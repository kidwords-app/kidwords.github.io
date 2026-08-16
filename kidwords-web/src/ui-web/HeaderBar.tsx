import { Box, Flex, Heading, HStack, Input, NativeSelectField, NativeSelectIndicator, NativeSelectRoot, Text } from "@chakra-ui/react";
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
    <Flex direction="column" gap={5}>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={4}
        align={{ md: "center" }}
        justify="space-between"
      >
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

        <Box maxW={{ base: "full", md: "280px" }} w={{ base: "full", md: "auto" }}>
          <Text fontSize="xs" fontWeight="semibold" color="gray.500" mb={1.5} textTransform="uppercase" letterSpacing="wide">
            Reading level
          </Text>
          <NativeSelectRoot size="md">
            <NativeSelectField
              value={level}
              onChange={(e) => onLevelChange(e.target.value as LevelId)}
              rounded="xl"
              border="2px solid"
              borderColor="purple.100"
              bg="white"
              fontSize="md"
              pr={10}
            >
              {levels.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </NativeSelectField>
            <NativeSelectIndicator color="gray.600" />
          </NativeSelectRoot>
        </Box>
      </Flex>

      <Box position="relative" w="full">
        <Box
          position="absolute"
          left={5}
          top="50%"
          transform="translateY(-50%)"
          pointerEvents="none"
          zIndex={1}
          fontSize="xl"
          aria-hidden
        >
          🔎
        </Box>
        <Input
          size="lg"
          bg="white"
          pl={14}
          pr={5}
          py={7}
          fontSize="lg"
          rounded="2xl"
          border="2px solid"
          borderColor="purple.200"
          shadow="md"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search words…"
          _placeholder={{ color: "gray.400" }}
          _hover={{ borderColor: "purple.300", shadow: "lg" }}
          _focusVisible={{
            borderColor: "purple.500",
            shadow: "0 0 0 3px var(--chakra-colors-purple-100)",
            outline: "none",
          }}
        />
      </Box>
    </Flex>
  );
}
