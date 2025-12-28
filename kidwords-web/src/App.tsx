// src/App.tsx
// KidWords — Chakra UI (refactored)
// Notes:
// - Data + logic live in src/core (portable to React Native later)
// - UI components live in src/ui-web
// - Level selection stays the same across word changes (single `level` state)

import React, { useEffect, useMemo, useState } from "react";
import { Box, Grid, VStack } from "@chakra-ui/react";

import { LEVELS, type LevelId, WORDS, type WordEntry } from "./core/words";
import { filterWords } from "./core/search";
import { runSelfTests } from "./core/selfTests";

import { HeaderBar } from "./ui-web/HeaderBar";
import { Sidebar } from "./ui-web/Sidebar";
import { DefinitionCard } from "./ui-web/DefinitionCard";
import { EmptyState } from "./ui-web/EmptyState";
import { TipsTabs } from "./ui-web/TipsTabs";

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
  const [pickedWord, setPickedWord] = useState<string>(WORDS[0]?.word ?? "");

  const filtered = useMemo(() => filterWords(WORDS, query), [query]);

  const current: WordEntry | null =
    filtered.find((w) => w.word === pickedWord) ?? filtered[0] ?? null;

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
          <Sidebar
            words={filtered}
            selectedWord={current?.word}
            onSelectWord={(w) => setPickedWord(w.word)}
          />

          <VStack align="stretch" spacing={4}>
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
    </Box>
  );
}
