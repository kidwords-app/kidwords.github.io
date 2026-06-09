import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider";
import { Signer } from "@aws-sdk/rds-signer";
import { Pool } from "pg";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const RDS_PORT = parseInt(requireEnv("RDS_PORT"), 10);
const RDS_HOSTNAME = requireEnv("RDS_HOSTNAME");
const RDS_DATABASE = requireEnv("RDS_DATABASE");
const RDS_USERNAME = requireEnv("RDS_USERNAME");
const AWS_REGION = requireEnv("AWS_REGION");
const AWS_ROLE_ARN = requireEnv("AWS_ROLE_ARN");

const signer = new Signer({
  credentials: awsCredentialsProvider({ roleArn: AWS_ROLE_ARN }),
  region: AWS_REGION,
  port: RDS_PORT,
  hostname: RDS_HOSTNAME,
  username: RDS_USERNAME,
});

const globalForPool = globalThis as typeof globalThis & { __kidwordsPgPool?: Pool };

export const pool: Pool =
  globalForPool.__kidwordsPgPool ??
  new Pool({
    password: signer.getAuthToken.bind(signer),
    user: RDS_USERNAME,
    host: RDS_HOSTNAME,
    database: RDS_DATABASE,
    port: RDS_PORT,
    max: 1,
    ssl: process.env.RDS_SSL === "false" ? undefined : { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPool.__kidwordsPgPool = pool;
}
