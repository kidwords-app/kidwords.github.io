import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider";

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getAwsRegion(): string {
  return requireEnv("AWS_REGION");
}

/** Vercel OIDC → IAM role credentials (same role used for RDS IAM auth). */
export function getAwsCredentials() {
  return awsCredentialsProvider({ roleArn: requireEnv("AWS_ROLE_ARN") });
}
