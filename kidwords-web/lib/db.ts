import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import { Signer } from "@aws-sdk/rds-signer";
import { Pool } from "pg";
import { getAwsCredentials, getAwsRegion, requireEnv } from "./aws.js";

// Vite reloads on .env.local changes; API routes run in a separate process and
// need an explicit load (and a full `vercel dev` restart after `vercel env pull`).
loadEnv({ path: resolve(process.cwd(), ".env.local") });

const globalForPool = globalThis as typeof globalThis & { __kidwordsPgPool?: Pool };

function createPool(): Pool {
  const rdsPort = parseInt(requireEnv("RDS_PORT"), 10);
  const rdsHostname = requireEnv("RDS_HOSTNAME");
  const rdsDatabase = requireEnv("RDS_DATABASE");
  const rdsUsername = requireEnv("RDS_USERNAME");

  const signer = new Signer({
    credentials: getAwsCredentials(),
    region: getAwsRegion(),
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
