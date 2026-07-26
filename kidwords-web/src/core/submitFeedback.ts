import type { LevelId } from "./words";

export type SubmitFeedbackInput = {
  word: string;
  level: LevelId;
  feedback: string;
};

export type SubmitFeedbackResult = {
  id: string;
  createdAt: string;
};

export class SubmitFeedbackError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "SubmitFeedbackError";
    this.status = status;
  }
}

export async function submitFeedback(
  input: SubmitFeedbackInput
): Promise<SubmitFeedbackResult> {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    let message = `Failed to save feedback (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) {
        message = body.error;
      }
    } catch {
      // keep default message
    }
    throw new SubmitFeedbackError(message, response.status);
  }

  return response.json() as Promise<SubmitFeedbackResult>;
}
