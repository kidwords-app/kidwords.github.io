import { Box, Button, Heading, VStack, Text } from "@chakra-ui/react";
import type { WordEntry, LevelId } from "../core/words";
import type { CategoryId } from "../core/categories";
import { getCategoriesForLevel, getAvailableCategories, type CategoryMetadata } from "../core/categories";

export function CategorySidebar(props: {
  words: WordEntry[];
  selectedCategory: CategoryId | null;
  level: LevelId;
  onSelectCategory: (categoryId: CategoryId | null) => void;
}) {
  const { words, selectedCategory, level, onSelectCategory } = props;

  const categoriesForLevel = getCategoriesForLevel(level);
  const availableCategories = getAvailableCategories(words, level);

  // If no categories are available, show empty state
  if (availableCategories.length === 0) {
    return (
      <Box bg="white" p={4} rounded="2xl" shadow="sm">
        <Heading size="md" mb={3}>
          Categories
        </Heading>
        <Text color="gray.600" fontSize="sm">
          No categories found, search for words
        </Text>
      </Box>
    );
  }

  return (
    <Box bg="white" p={4} rounded="2xl" shadow="sm">
      <Heading size="md" mb={3}>
        Categories
      </Heading>
      <VStack align="stretch" gap={2}>
        {/* Show "All" option */}
        <Button
          size="sm"
          rounded="md"
          onClick={() => onSelectCategory(null)}
          variant={selectedCategory === null ? "solid" : "outline"}
          colorScheme={selectedCategory === null ? "purple" : "gray"}
          justifyContent="flex-start"
        >
          {selectedCategory === null ? "📚 " : ""}All Words
        </Button>

        {/* Show available categories */}
        {availableCategories.map((categoryId) => {
          const category: CategoryMetadata = categoriesForLevel[categoryId];
          return (
            <Button
              key={categoryId}
              size="sm"
              rounded="md"
              onClick={() => onSelectCategory(categoryId)}
              variant={selectedCategory === categoryId ? "solid" : "outline"}
              colorScheme={selectedCategory === categoryId ? "purple" : "gray"}
              justifyContent="flex-start"
            >
              {category.emoji ? `${category.emoji} ` : ""}{category.label}
            </Button>
          );
        })}
      </VStack>
    </Box>
  );
}

