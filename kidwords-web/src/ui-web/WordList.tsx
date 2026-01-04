import { Box, Button, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import type { WordEntry } from "../core/words";

export function WordList(props: {
  words: WordEntry[];
  selectedWord?: string;
  onSelectWord: (w: WordEntry) => void;
}) {
  const { words, selectedWord, onSelectWord } = props;

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
      <Heading size="md" mb={3}>
        Words
      </Heading>
      <SimpleGrid columns={{ base: 2, md: 2 }} gap={2}>
        {words.map((w) => (
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
  );
}

