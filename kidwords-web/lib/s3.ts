import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getAwsCredentials, getAwsRegion, requireEnv } from "./aws.js";
import { logRds } from "./logger.js";

export type S3ObjectRef = {
  bucket: string;
  key: string;
};

const DEFAULT_PRESIGN_EXPIRES_SECONDS = 3600;

let s3Client: S3Client | undefined;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: getAwsRegion(),
      credentials: getAwsCredentials(),
    });
  }
  return s3Client;
}

function defaultBucket(): string | undefined {
  return process.env.S3_IMAGES_BUCKET?.trim() || undefined;
}

function presignExpiresSeconds(): number {
  const raw = process.env.S3_PRESIGN_EXPIRES_SECONDS;
  if (!raw) {
    return DEFAULT_PRESIGN_EXPIRES_SECONDS;
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid S3_PRESIGN_EXPIRES_SECONDS: ${raw}`);
  }
  return parsed;
}

/**
 * Parses RDS `image_s3_key` into bucket + object key.
 * Accepts bare keys (needs `S3_IMAGES_BUCKET`), `s3://bucket/key`, or HTTPS S3 URLs.
 */
export function parseS3ObjectRef(value: string, fallbackBucket = defaultBucket()): S3ObjectRef | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const s3Uri = /^s3:\/\/([^/]+)\/(.+)$/i.exec(trimmed);
  if (s3Uri) {
    return { bucket: s3Uri[1], key: s3Uri[2] };
  }

  const virtualHosted =
    /^https?:\/\/([^.]+)\.s3(?:[.-][a-z0-9-]+)?\.amazonaws\.com\/(.+)$/i.exec(trimmed);
  if (virtualHosted) {
    return {
      bucket: virtualHosted[1],
      key: decodeURIComponent(virtualHosted[2].split("?")[0]),
    };
  }

  const pathStyle =
    /^https?:\/\/s3(?:[.-][a-z0-9-]+)?\.amazonaws\.com\/([^/]+)\/(.+)$/i.exec(trimmed);
  if (pathStyle) {
    return {
      bucket: pathStyle[1],
      key: decodeURIComponent(pathStyle[2].split("?")[0]),
    };
  }

  if (!trimmed.includes("://") && fallbackBucket) {
    return { bucket: fallbackBucket, key: trimmed.replace(/^\//, "") };
  }

  return null;
}

/** Creates a time-limited HTTPS GET URL for a private S3 object. */
export async function presignGetObjectUrl(ref: S3ObjectRef): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: ref.bucket,
    Key: ref.key,
  });
  return getSignedUrl(getS3Client(), command, {
    expiresIn: presignExpiresSeconds(),
  });
}

/**
 * Resolves RDS `image_s3_key` values to presigned HTTPS URLs.
 * Unknown/unparseable keys are omitted; individual presign failures are logged and skipped.
 */
export async function presignImageUrls(
  keys: Iterable<string | null | undefined>
): Promise<Map<string, string>> {
  const unique = [...new Set([...keys].map((k) => k?.trim()).filter((k): k is string => Boolean(k)))];
  const resolved = new Map<string, string>();

  if (unique.length === 0) {
    return resolved;
  }

  // Ensure AWS env is present up front (clearer than per-key failures).
  requireEnv("AWS_REGION");
  requireEnv("AWS_ROLE_ARN");

  await Promise.all(
    unique.map(async (raw) => {
      const ref = parseS3ObjectRef(raw);
      if (!ref) {
        logRds(
          "s3.presign.skip",
          { imageS3Key: raw, reason: "unparseable (set S3_IMAGES_BUCKET for bare keys)" },
          "error"
        );
        return;
      }

      try {
        const url = await presignGetObjectUrl(ref);
        resolved.set(raw, url);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logRds(
          "s3.presign.error",
          { bucket: ref.bucket, key: ref.key, error: message },
          "error"
        );
      }
    })
  );

  return resolved;
}
