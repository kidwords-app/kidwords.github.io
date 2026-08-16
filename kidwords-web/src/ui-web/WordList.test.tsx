import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { WordList, WORDS_PER_PAGE } from "./WordList";
import type { WordEntry } from "../core/words";

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider value={defaultSystem}>{component}</ChakraProvider>);
};

function makeWords(count: number): WordEntry[] {
  return Array.from({ length: count }, (_, index) => ({
    word: `word${String(index + 1).padStart(3, "0")}`,
    partOfSpeech: "noun",
    syllables: 1,
    tags: ["thinking"],
    cartoonId: "choice",
    levels: {
      preK: { definition: "d", example: "e", tryIt: "t", speak: "S" },
      K: { definition: "d", example: "e", tryIt: "t", speak: "S" },
      G1: { definition: "d", example: "e", tryIt: "t", speak: "S" },
    },
  }));
}

describe("WordList", () => {
  const mockOnSelectWord = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows only the first page of words with pagination controls", () => {
    const words = makeWords(30);
    renderWithChakra(
      <WordList words={words} selectedWord={words[0].word} onSelectWord={mockOnSelectWord} />
    );

    expect(screen.getByText("word001")).toBeInTheDocument();
    expect(screen.getByText(`word${String(WORDS_PER_PAGE).padStart(3, "0")}`)).toBeInTheDocument();
    expect(screen.queryByText(`word${String(WORDS_PER_PAGE + 1).padStart(3, "0")}`)).not.toBeInTheDocument();
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    expect(screen.getByText(`1–${WORDS_PER_PAGE} of 30`)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
  });

  it("advances to the next page when Next is clicked", async () => {
    const user = userEvent.setup();
    const words = makeWords(30);
    renderWithChakra(
      <WordList words={words} selectedWord={words[0].word} onSelectWord={mockOnSelectWord} />
    );

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText(`word${String(WORDS_PER_PAGE + 1).padStart(3, "0")}`)).toBeInTheDocument();
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled();
  });

  it("jumps to the page containing the selected word", () => {
    const words = makeWords(30);
    renderWithChakra(
      <WordList words={words} selectedWord="word025" onSelectWord={mockOnSelectWord} />
    );

    expect(screen.getByText("word025")).toBeInTheDocument();
    expect(screen.getByText("Page 3 of 3")).toBeInTheDocument();
    expect(screen.getByText("25–30 of 30")).toBeInTheDocument();
  });

  it("resets to the first page when the word list changes", async () => {
    const user = userEvent.setup();
    const firstBatch = makeWords(30);
    const secondBatch = makeWords(20);

    const { rerender } = renderWithChakra(
      <WordList words={firstBatch} selectedWord={firstBatch[0].word} onSelectWord={mockOnSelectWord} />
    );

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();

    rerender(
      <ChakraProvider value={defaultSystem}>
        <WordList words={secondBatch} selectedWord={secondBatch[0].word} onSelectWord={mockOnSelectWord} />
      </ChakraProvider>
    );

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(screen.getByText("word001")).toBeInTheDocument();
  });

  it("hides pagination when all words fit on one page", () => {
    const words = makeWords(WORDS_PER_PAGE);
    renderWithChakra(
      <WordList words={words} selectedWord={words[0].word} onSelectWord={mockOnSelectWord} />
    );

    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
    expect(screen.queryByText(/Page \d+ of/)).not.toBeInTheDocument();
  });
});
