import { useEffect, useState } from "react";
import { Badge, Box, Grid, Heading, HStack, Image, Text, VStack } from "@chakra-ui/react";
import type { LevelId, WordEntry } from "../core/words";

function cartoonSrc(cartoonId: string) {
  return `/cartoons/${cartoonId}.png`;
}

export function DefinitionCard({ word, level }: { word: WordEntry; level: LevelId }) {
  const L = word.levels[level];
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [word.cartoonId]);

  return (
    <Box bg="white" p={6} rounded="2xl" shadow="md">
      <HStack align="center" gap={4} mb={4}>
        <Box boxSize="16" rounded="xl" bg="purple.50" display="flex" alignItems="center" justifyContent="center">
          📖
        </Box>
        <Box>
          <Heading size="lg" textTransform="capitalize">
            {word.word}
          </Heading>
          <HStack gap={2} color="gray.600" fontSize="sm" mt={1}>
            <Badge colorScheme="purple" rounded="full">
              {word.partOfSpeech}
            </Badge>
            <Text>• {word.syllables} syllables</Text>
            <Text>
              • <i>{L.speak}</i>
            </Text>
          </HStack>
        </Box>
      </HStack>

      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6} alignItems="start">
        <VStack align="stretch" gap={4}>
          <Box>
            <Text fontWeight="semibold">What it means</Text>
            <Text mt={1} fontSize="lg">
              {L.definition}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="semibold">Example</Text>
            <Text mt={1} fontSize="lg">
              “{L.example}”
            </Text>
          </Box>
          <Box>
            <Text fontWeight="semibold">Try it!</Text>
            <Text mt={1}>{L.tryIt}</Text>
          </Box>

          <HStack gap={2} pt={2} flexWrap="wrap">
            {word.tags.map((t) => (
              <Badge key={t} size="sm" colorScheme="pink" rounded="full" px={2} py={1}>
                {t}
              </Badge>
            ))}
          </HStack>
        </VStack>

        <Box w="full" maxW={{ base: "240px", md: "300px" }} mx={{ base: "auto", md: 0 }}>
          {imageError ? (
            <Box bg="purple.50" rounded="xl" p={4} textAlign="center" fontSize="sm" minH="180px" display="flex" alignItems="center" justifyContent="center">
              <Box>
                Add image<br />
                /public/cartoons/{word.cartoonId}.png
              </Box>
            </Box>
          ) : (
            <Image
              src={cartoonSrc(word.cartoonId)}
              alt={`Cartoon of ${word.word}`}
              borderRadius="xl"
              shadow="md"
              maxW="100%"
              maxH="400px"
              w="auto"
              h="auto"
              mx="auto"
              onError={() => setImageError(true)}
            />
          )}
        </Box>
      </Grid>
    </Box>
  );
}
