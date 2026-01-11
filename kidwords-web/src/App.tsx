// src/App.tsx
// KidWords — Chakra UI (refactored)
// Notes:
// - Data + logic live in src/core (portable to React Native later)
// - UI components live in src/ui-web
// - Level selection stays the same across word changes (single `level` state)

import { useEffect, useMemo, useState } from "react";
import { Box, Grid, VStack } from "@chakra-ui/react";

import { LEVELS, type LevelId, WORDS, type WordEntry } from "./core/words";
import { filterWords } from "./core/search";
import { runSelfTests } from "./core/selfTests";
import type { CategoryId } from "./core/categories";
import { tagToCategoryId } from "./core/categories";

import { HeaderBar } from "./ui-web/HeaderBar";
import { CategorySidebar } from "./ui-web/CategorySidebar";
import { WordList } from "./ui-web/WordList";
import { DefinitionCard } from "./ui-web/DefinitionCard";
import { EmptyState } from "./ui-web/EmptyState";
import { TipsTabs } from "./ui-web/TipsTabs";
import { FeedbackButton } from "./ui-web/FeedbackButton";

export default function App() {
  // Run self-tests once in dev
  useEffect(() => {
    try {
      runSelfTests();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }, []);

  const [level, setLevel] = useState<LevelId>("K");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [pickedWord, setPickedWord] = useState<string>(WORDS[0]?.word ?? "");

  // Filter words by search query
  const searchFiltered = useMemo(() => filterWords(WORDS, query), [query]);

  // Filter words by selected category
  const categoryFiltered = useMemo(() => {
    if (selectedCategory === null) {
      return searchFiltered;
    }
    return searchFiltered.filter((word) => {
      return word.tags.some((tag) => tagToCategoryId(tag) === selectedCategory);
    });
  }, [searchFiltered, selectedCategory]);

  const current: WordEntry | null =
    categoryFiltered.find((w) => w.word === pickedWord) ?? categoryFiltered[0] ?? null;

  // Reset selected word when category or level changes
  useEffect(() => {
    if (categoryFiltered.length > 0 && !categoryFiltered.find((w) => w.word === pickedWord)) {
      setPickedWord(categoryFiltered[0].word);
    }
  }, [categoryFiltered, pickedWord]);

  return (
    <Box minH="100dvh" bgGradient="linear(to-b, purple.50, white)">
      <Box maxW="6xl" mx="auto" p={{ base: 4, md: 8 }}>
        <HeaderBar
          level={level}
          levels={LEVELS}
          query={query}
          onLevelChange={setLevel}
          onQueryChange={setQuery}
        />

        <Grid
          templateColumns={{ base: "1fr", md: "1fr 2fr" }}
          gap={6}
          alignItems="start"
          mt={6}
        >
          <VStack align="stretch" gap={6}>
            <CategorySidebar
              words={searchFiltered}
              selectedCategory={selectedCategory}
              level={level}
              onSelectCategory={setSelectedCategory}
            />

            <WordList
              words={categoryFiltered.slice(0, 10)}
              selectedWord={current?.word}
              onSelectWord={(w) => setPickedWord(w.word)}
            />
          </VStack>

          <VStack align="stretch" gap={4}>
            {current ? (
              <DefinitionCard word={current} level={level} />
            ) : (
              <EmptyState />
            )}
            <TipsTabs />
          </VStack>
        </Grid>

        <Box
          as="footer"
          pt={4}
          textAlign="center"
          fontSize="xs"
          color="gray.600"
        >
          Add PNGs in <code>/public/cartoons/</code> (e.g., empathy.png, happy.png)
        </Box>
      </Box>
      <FeedbackButton />
    </Box>
  );
}
