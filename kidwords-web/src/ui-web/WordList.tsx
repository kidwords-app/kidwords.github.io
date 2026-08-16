import { useEffect, useState } from "react";
import { Box, Button, Heading, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import type { WordEntry } from "../core/words";

export const WORDS_PER_PAGE = 12;

function pageForWordIndex(index: number): number {
  return Math.floor(index / WORDS_PER_PAGE);
}

export function WordList(props: {
  words: WordEntry[];
  selectedWord?: string;
  onSelectWord: (w: WordEntry) => void;
}) {
  const { words, selectedWord, onSelectWord } = props;
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(words.length / WORDS_PER_PAGE));
  const safePage = Math.min(page, pageCount - 1);
  const pageStart = safePage * WORDS_PER_PAGE;
  const pageWords = words.slice(pageStart, pageStart + WORDS_PER_PAGE);
  const pageEnd = Math.min(pageStart + WORDS_PER_PAGE, words.length);

  useEffect(() => {
    setPage(0);
  }, [words]);

  useEffect(() => {
    if (!selectedWord) return;
    const selectedIndex = words.findIndex((w) => w.word === selectedWord);
    if (selectedIndex === -1) return;
    const selectedPage = pageForWordIndex(selectedIndex);
    setPage((current) => (current === selectedPage ? current : selectedPage));
  }, [selectedWord, words]);

  if (words.length === 0) {
    return (
      <Box bg="white" p={4} rounded="2xl" shadow="sm">
        <Heading size="md" mb={3}>
          Words
        </Heading>
        <Text color="gray.600" fontSize="sm">
          No words found
        </Text>
      </Box>
    );
  }

  return (
    <Box bg="white" p={4} rounded="2xl" shadow="sm">
      <HStack justify="space-between" align="baseline" mb={3}>
        <Heading size="md">Words</Heading>
        {words.length > WORDS_PER_PAGE && (
          <Text color="gray.500" fontSize="xs">
            Page {safePage + 1} of {pageCount}
          </Text>
        )}
      </HStack>

      <Box maxH="18rem" overflowY="auto" pr={1}>
        <SimpleGrid columns={{ base: 2, md: 2 }} gap={2}>
          {pageWords.map((w) => (
            <Button
              key={w.word}
              size="sm"
              rounded="full"
              onClick={() => onSelectWord(w)}
              variant={selectedWord === w.word ? "solid" : "outline"}
              colorScheme={selectedWord === w.word ? "purple" : "gray"}
            >
              {w.word}
            </Button>
          ))}
        </SimpleGrid>
      </Box>

      {words.length > WORDS_PER_PAGE && (
        <HStack justify="space-between" align="center" mt={3} gap={2}>
          <Button
            size="sm"
            variant="outline"
            colorScheme="purple"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={safePage === 0}
          >
            Previous
          </Button>
          <Text color="gray.500" fontSize="xs" textAlign="center">
            {pageStart + 1}–{pageEnd} of {words.length}
          </Text>
          <Button
            size="sm"
            variant="outline"
            colorScheme="purple"
            onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
            disabled={safePage >= pageCount - 1}
          >
            Next
          </Button>
        </HStack>
      )}
    </Box>
  );
}
