import { Box, Flex, Heading, HStack, Input, Text } from "@chakra-ui/react";
import type { LevelId } from "../core/words";

export function HeaderBar(props: {
  level: LevelId;
  levels: { id: LevelId; label: string }[];
  query: string;
  onLevelChange: (l: LevelId) => void;
  onQueryChange: (s: string) => void;
}) {
  const { level, levels, query, onLevelChange, onQueryChange } = props;

  return (
    <Flex direction={{ base: "column", md: "row" }} gap={4} align={{ md: "center" }} justify="space-between">
      <HStack gap={3}>
        <Box boxSize="10" rounded="2xl" bg="purple.600" color="white" display="grid" placeItems="center" shadow="md">
          📚
        </Box>
        <Box>
          <Heading size="lg">KidWords</Heading>
          <Text fontSize="sm" color="gray.600">
            Friendly explanations for toddlers to first graders
          </Text>
        </Box>
      </HStack>

      <Flex gap={3} w={{ base: "full", md: "auto" }} direction={{ base: "column", sm: "row" }}>
        <Box position="relative" maxW={{ base: "full", sm: "260px" }}>
          <Box
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
            zIndex={1}
          >
            🔎
          </Box>
          <Input
            bg="white"
            pl={10}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search words…"
          />
        </Box>

        <Box maxW={{ base: "full", sm: "260px" }} w={{ base: "full", sm: "auto" }}>
          <select
            value={level}
            onChange={(e) => onLevelChange(e.target.value as LevelId)}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.375rem",
              border: "1px solid",
              borderColor: "#e2e8f0",
              fontSize: "0.875rem",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            {levels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </Box>
      </Flex>
    </Flex>
  );
}
