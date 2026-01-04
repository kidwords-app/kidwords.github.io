import type { LevelId } from "./words";

// Category IDs normalized across all levels
export type CategoryId =
  | "feelings"
  | "actions"
  | "describing"
  | "friends"
  | "thinking"
  | "nature"
  | "play"
  | "time";

// Category metadata
export type CategoryMetadata = {
  label: string;
  description: string;
  emoji?: string;
};

// Categories for each level
export const CATEGORIES: Record<LevelId, Record<CategoryId, CategoryMetadata>> = {
  preK: {
    feelings: {
      label: "How We Feel",
      description: "Words about feelings and emotions",
      emoji: "😊",
    },
    actions: {
      label: "Things We Do",
      description: "Words about actions and activities",
      emoji: "🏃",
    },
    describing: {
      label: "Describing Words",
      description: "Words that describe things",
      emoji: "✨",
    },
    friends: {
      label: "Friends",
      description: "Words about friends and people",
      emoji: "👫",
    },
    thinking: {
      label: "Thinking",
      description: "Words about thinking and learning",
      emoji: "🧠",
    },
    nature: {
      label: "World",
      description: "Words about nature, science, and the world",
      emoji: "🌍",
    },
    play: {
      label: "Play",
      description: "Words about playing and toys",
      emoji: "🎮",
    },
    time: {
      label: "My Date",
      description: "Words about time and routines",
      emoji: "📅",
    },
  },
  K: {
    feelings: {
      label: "Feelings",
      description: "Words about feelings and emotions",
      emoji: "😊",
    },
    actions: {
      label: "Actions",
      description: "Words about actions and activities",
      emoji: "🏃",
    },
    describing: {
      label: "Describing Words",
      description: "Words that describe things",
      emoji: "✨",
    },
    friends: {
      label: "Friends and School",
      description: "Words about friends, school, and community",
      emoji: "👫",
    },
    thinking: {
      label: "Thinking and Learning",
      description: "Words about thinking and learning",
      emoji: "🧠",
    },
    nature: {
      label: "World",
      description: "Words about nature, science, and the world",
      emoji: "🌍",
    },
    play: {
      label: "Play and Make",
      description: "Words about playing, making, and creating",
      emoji: "🎮",
    },
    time: {
      label: "My Day",
      description: "Words about time, routines, and daily activities",
      emoji: "📅",
    },
  },
  G1: {
    feelings: {
      label: "Emotions",
      description: "Words about emotions and feelings",
      emoji: "😊",
    },
    actions: {
      label: "Actions",
      description: "Words about actions and activities",
      emoji: "🏃",
    },
    describing: {
      label: "Describing Words",
      description: "Words that describe things",
      emoji: "✨",
    },
    friends: {
      label: "Friends and Community",
      description: "Words about friends, community, and relationships",
      emoji: "👫",
    },
    thinking: {
      label: "Thinking and Learning",
      description: "Words about thinking and learning",
      emoji: "🧠",
    },
    nature: {
      label: "World",
      description: "Words about nature, science, and the world",
      emoji: "🌍",
    },
    play: {
      label: "Play and Create",
      description: "Words about playing, creating, and making things",
      emoji: "🎮",
    },
    time: {
      label: "Time and Routines",
      description: "Words about time, routines, and schedules",
      emoji: "📅",
    },
  },
};

/**
 * Maps word tags to category IDs
 * This function normalizes word tags (like "feelings", "space", "describing", "actions", "toys")
 * to the standardized category IDs
 */
export function tagToCategoryId(tag: string): CategoryId | null {
  const normalizedTag = tag.toLowerCase().trim();

  // Direct mappings
  if (normalizedTag === "feelings" || normalizedTag === "emotion" || normalizedTag === "emotions") {
    return "feelings";
  }
  if (normalizedTag === "actions" || normalizedTag === "action") {
    return "actions";
  }
  if (normalizedTag === "describing" || normalizedTag === "description") {
    return "describing";
  }
  if (normalizedTag === "friends" || normalizedTag === "friend" || normalizedTag === "community") {
    return "friends";
  }
  if (normalizedTag === "thinking" || normalizedTag === "learning") {
    return "thinking";
  }
  if (normalizedTag === "nature" || normalizedTag === "space" || normalizedTag === "science" || normalizedTag === "world") {
    return "nature";
  }
  if (normalizedTag === "play" || normalizedTag === "toys" || normalizedTag === "toy" || normalizedTag === "create" || normalizedTag === "making") {
    return "play";
  }
  if (normalizedTag === "time" || normalizedTag === "routines" || normalizedTag === "routine" || normalizedTag === "day") {
    return "time";
  }

  return null;
}

/**
 * Gets all categories for a given level
 */
export function getCategoriesForLevel(level: LevelId): Record<CategoryId, CategoryMetadata> {
  return CATEGORIES[level];
}

/**
 * Gets category IDs that have at least one word in the given word list
 */
export function getAvailableCategories(
  words: Array<{ tags: string[] }>,
  level: LevelId
): CategoryId[] {
  const categorySet = new Set<CategoryId>();

  for (const word of words) {
    for (const tag of word.tags) {
      const categoryId = tagToCategoryId(tag);
      if (categoryId) {
        categorySet.add(categoryId);
      }
    }
  }

  // Return in the order defined in CATEGORIES
  const allCategories = Object.keys(CATEGORIES[level]) as CategoryId[];
  return allCategories.filter((id) => categorySet.has(id));
}

