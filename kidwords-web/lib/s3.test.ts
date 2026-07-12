import { afterEach, describe, expect, it } from "vitest";
import { parseS3ObjectRef } from "./s3.js";

describe("parseS3ObjectRef", () => {
  afterEach(() => {
    delete process.env.S3_IMAGES_BUCKET;
  });

  it("parses s3:// URIs", () => {
    expect(parseS3ObjectRef("s3://kidwords-images/words/empathy.png")).toEqual({
      bucket: "kidwords-images",
      key: "words/empathy.png",
    });
  });

  it("parses virtual-hosted HTTPS URLs", () => {
    expect(
      parseS3ObjectRef("https://kidwords-images.s3.us-east-1.amazonaws.com/words/happy.png")
    ).toEqual({
      bucket: "kidwords-images",
      key: "words/happy.png",
    });
  });

  it("parses path-style HTTPS URLs", () => {
    expect(
      parseS3ObjectRef("https://s3.us-east-1.amazonaws.com/kidwords-images/words/happy.png")
    ).toEqual({
      bucket: "kidwords-images",
      key: "words/happy.png",
    });
  });

  it("uses fallback bucket for bare keys", () => {
    expect(parseS3ObjectRef("words/empathy.png", "kidwords-images")).toEqual({
      bucket: "kidwords-images",
      key: "words/empathy.png",
    });
  });

  it("returns null for bare keys without a bucket", () => {
    expect(parseS3ObjectRef("words/empathy.png")).toBeNull();
  });

  it("strips query strings from HTTPS URLs", () => {
    expect(
      parseS3ObjectRef(
        "https://kidwords-images.s3.amazonaws.com/words/happy.png?X-Amz-Signature=abc"
      )
    ).toEqual({
      bucket: "kidwords-images",
      key: "words/happy.png",
    });
  });
});
