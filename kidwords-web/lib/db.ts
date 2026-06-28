import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider";
import { Signer } from "@aws-sdk/rds-signer";
import { Pool } from "pg";

// Vite reloads on .env.local changes; API routes run in a separate process and
// need an explicit load (and a full `vercel dev` restart after `vercel env pull`).
loadEnv({ path: resolve(process.cwd(), ".env.local") });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const globalForPool = globalThis as typeof globalThis & { __kidwordsPgPool?: Pool };

function createPool(): Pool {
  const rdsPort = parseInt(requireEnv("RDS_PORT"), 10);
  const rdsHostname = requireEnv("RDS_HOSTNAME");
  const rdsDatabase = requireEnv("RDS_DATABASE");
  const rdsUsername = requireEnv("RDS_USERNAME");
  const awsRegion = requireEnv("AWS_REGION");
  const awsRoleArn = requireEnv("AWS_ROLE_ARN");

  const signer = new Signer({
    credentials: awsCredentialsProvider({ roleArn: awsRoleArn }),
    region: awsRegion,
    port: rdsPort,
    hostname: rdsHostname,
    username: rdsUsername,
  });

  return new Pool({
    password: signer.getAuthToken.bind(signer),
    user: rdsUsername,
    host: rdsHostname,
    database: rdsDatabase,
    port: rdsPort,
    max: 1,
    ssl: process.env.RDS_SSL === "false" ? undefined : { rejectUnauthorized: false },
  });
}

/** Lazy pool — env vars are read on first query, not at module import. */
export function getPool(): Pool {
  if (!globalForPool.__kidwordsPgPool) {
    globalForPool.__kidwordsPgPool = createPool();
  }
  return globalForPool.__kidwordsPgPool;
}
