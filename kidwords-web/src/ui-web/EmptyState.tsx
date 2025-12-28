import { Box, Text } from "@chakra-ui/react";

export function EmptyState() {
  return (
    <Box p={10} textAlign="center" bg="white" rounded="2xl" shadow="sm">
      <Text fontSize="xl" fontWeight="semibold">
        Search for a word
      </Text>
      <Text color="gray.600" mt={2}>
        Try words like “empathy”, “happy”, or “rocket”.
      </Text>
    </Box>
  );
}
