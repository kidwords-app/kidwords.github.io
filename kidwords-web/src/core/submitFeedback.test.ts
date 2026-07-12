import { describe, it, expect, vi, afterEach } from "vitest";
import { submitFeedback, SubmitFeedbackError } from "./submitFeedback";

describe("submitFeedback", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("POSTs JSON and returns the created row", async () => {
    const payload = { id: "abc", createdAt: "2026-01-01T00:00:00.000Z" };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(payload),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      submitFeedback({ word: "empathy", level: "K", feedback: "nice" })
    ).resolves.toEqual(payload);

    expect(fetchMock).toHaveBeenCalledWith("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: "empathy", level: "K", feedback: "nice" }),
    });
  });

  it("throws SubmitFeedbackError with API message on failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            error: "This word is not published for the selected grade",
          }),
      })
    );

    await expect(
      submitFeedback({ word: "missing", level: "K", feedback: "x" })
    ).rejects.toMatchObject({
      name: "SubmitFeedbackError",
      status: 404,
      message: "This word is not published for the selected grade",
    } satisfies Partial<SubmitFeedbackError>);
  });

  it("throws with status fallback when body is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error("no json")),
      })
    );

    await expect(
      submitFeedback({ word: "empathy", level: "K", feedback: "x" })
    ).rejects.toThrow("Failed to save feedback (500)");
  });
});
