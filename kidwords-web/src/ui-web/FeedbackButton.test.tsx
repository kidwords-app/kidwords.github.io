import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeedbackButton } from "./FeedbackButton";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import * as submitFeedbackModule from "../core/submitFeedback";

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>{component}</ChakraProvider>
  );
};

const defaultProps = {
  word: "empathy",
  level: "K" as const,
  levelLabel: "Kindergarten",
  eligible: true,
};

async function passAdultGate(user: ReturnType<typeof userEvent.setup>) {
  const questionText = await screen.findByText(/What is \d+ \+ \d+\?/);
  const match = questionText.textContent?.match(/What is (\d+) \+ (\d+)\?/);
  expect(match).toBeTruthy();
  const correctAnswer =
    parseInt(match![1], 10) + parseInt(match![2], 10);

  const input = screen.getByPlaceholderText("Enter your answer");
  await user.clear(input);
  await user.type(input, String(correctAnswer));
  await user.click(screen.getByText("Verify"));

  await waitFor(() => {
    expect(screen.getByText("Share feedback")).toBeInTheDocument();
  });
}

describe("FeedbackButton", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders nothing when not eligible", () => {
    renderWithChakra(<FeedbackButton {...defaultProps} eligible={false} />);
    expect(screen.queryByText("Feedback")).not.toBeInTheDocument();
  });

  it("should render feedback button when eligible", () => {
    renderWithChakra(<FeedbackButton {...defaultProps} />);
    expect(screen.getByText("Feedback")).toBeInTheDocument();
  });

  it("should open adult gate when button is clicked", async () => {
    const user = userEvent.setup();
    renderWithChakra(<FeedbackButton {...defaultProps} />);

    await user.click(screen.getByText("Feedback"));

    await waitFor(() => {
      expect(screen.getByText("Adult Verification")).toBeInTheDocument();
    });
  });

  it("should show error for incorrect answer", async () => {
    const user = userEvent.setup();
    renderWithChakra(<FeedbackButton {...defaultProps} />);

    await user.click(screen.getByText("Feedback"));

    const questionText = await screen.findByText(/What is \d+ \+ \d+\?/);
    const match = questionText.textContent?.match(/What is (\d+) \+ (\d+)\?/);
    expect(match).toBeTruthy();
    const wrongAnswer =
      parseInt(match![1], 10) + parseInt(match![2], 10) + 1;

    const input = screen.getByPlaceholderText("Enter your answer");
    await user.clear(input);
    await user.type(input, String(wrongAnswer));
    await user.click(screen.getByText("Verify"));

    await waitFor(() => {
      expect(
        screen.getByText("Incorrect answer. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("should show form after correct answer and submit feedback", async () => {
    const user = userEvent.setup();
    const submitSpy = vi
      .spyOn(submitFeedbackModule, "submitFeedback")
      .mockResolvedValue({ id: "1", createdAt: "2026-01-01T00:00:00.000Z" });

    renderWithChakra(<FeedbackButton {...defaultProps} />);
    await user.click(screen.getByText("Feedback"));
    await passAdultGate(user);

    expect(screen.getByText(/empathy/)).toBeInTheDocument();
    expect(screen.getByText(/Kindergarten/)).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(
      "What could we improve about this word?"
    );
    await user.type(textarea, "Great definition");
    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith({
        word: "empathy",
        level: "K",
        feedback: "Great definition",
      });
      expect(screen.getByText(/Thanks/)).toBeInTheDocument();
    });
  });

  it("should show error when submit fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(submitFeedbackModule, "submitFeedback").mockRejectedValue(
      new Error("network")
    );

    renderWithChakra(<FeedbackButton {...defaultProps} />);
    await user.click(screen.getByText("Feedback"));
    await passAdultGate(user);

    await user.type(
      screen.getByPlaceholderText("What could we improve about this word?"),
      "oops"
    );
    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Please try again")).toBeInTheDocument();
    });
  });

  it("should close modal when close button is clicked", async () => {
    const user = userEvent.setup();
    renderWithChakra(<FeedbackButton {...defaultProps} />);

    await user.click(screen.getByText("Feedback"));
    await waitFor(() => {
      expect(screen.getByText("Adult Verification")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryByText("Adult Verification")).not.toBeInTheDocument();
    });
  });

  it("should disable verify button when input is empty", async () => {
    const user = userEvent.setup();
    renderWithChakra(<FeedbackButton {...defaultProps} />);

    await user.click(screen.getByText("Feedback"));
    await waitFor(() => {
      expect(screen.getByText("Adult Verification")).toBeInTheDocument();
    });

    expect(screen.getByText("Verify")).toBeDisabled();
  });

  it("should not use mailto", async () => {
    const user = userEvent.setup();
    vi.spyOn(submitFeedbackModule, "submitFeedback").mockResolvedValue({
      id: "1",
      createdAt: "2026-01-01T00:00:00.000Z",
    });

    renderWithChakra(<FeedbackButton {...defaultProps} />);
    await user.click(screen.getByText("Feedback"));
    await passAdultGate(user);
    await user.type(
      screen.getByPlaceholderText("What could we improve about this word?"),
      "hi"
    );
    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText(/Thanks/)).toBeInTheDocument();
    });
    expect(window.location.href).not.toContain("mailto:");
  });
});
