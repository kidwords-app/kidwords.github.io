export type LevelId = "preK" | "K" | "G1";

export const LEVELS: { id: LevelId; label: string }[] = [
  { id: "preK", label: "Age 3–4 (Pre-K)" },
  { id: "K", label: "Kindergarten" },
  { id: "G1", label: "1st Grade" },
];

export type LevelCopy = {
  speak: string;
  definition: string;
  example: string;
  tryIt: string;
};

export type WordEntry = {
  word: string;
  partOfSpeech: string;
  syllables: number;
  tags: string[];
  cartoonId: string; // e.g. "empathy" -> web: /cartoons/empathy.png, native: imageMap.empathy
  levels: Record<LevelId, LevelCopy>;
};

export const WORDS: WordEntry[] = [
  {
    word: "empathy",
    partOfSpeech: "noun",
    syllables: 3,
    tags: ["feelings"],
    cartoonId: "empathy",
    levels: {
      preK: {
        speak: "EM-puh-thee",
        definition: "Caring about how someone else feels.",
        example: "I give a hug when my friend is sad.",
        tryIt: "Ask a friend, ‘How are you?’ and listen.",
      },
      K: {
        speak: "EM-puh-thee",
        definition: "Understanding another person’s feelings and showing kindness.",
        example: "Sam shared his toy when Maya looked left out.",
        tryIt: "Notice a feeling face today and help.",
      },
      G1: {
        speak: "EM-puh-thee",
        definition: "When you imagine how someone feels and choose to be helpful.",
        example: "Cara said, ‘Are you okay?’ when Leo fell.",
        tryIt: "Think: ‘How would I feel?’ then act kindly.",
      },
    },
  },
  {
    word: "happy",
    partOfSpeech: "adjective",
    syllables: 2,
    tags: ["feelings"],
    cartoonId: "happy",
    levels: {
      preK: {
        speak: "HAP-ee",
        definition: "Feeling good inside.",
        example: "I feel happy when we dance.",
        tryIt: "Show a happy face in the mirror.",
      },
      K: {
        speak: "HAP-ee",
        definition: "A joyful feeling; the opposite of sad.",
        example: "Sharing snacks makes us happy.",
        tryIt: "Tell a friend what made you happy today.",
      },
      G1: {
        speak: "HAP-ee",
        definition: "Glad and cheerful.",
        example: "I felt happy after finishing my drawing.",
        tryIt: "Write one ‘happy’ sentence.",
      },
    },
  },
  {
    word: "rocket",
    partOfSpeech: "noun",
    syllables: 2,
    tags: ["space"],
    cartoonId: "rocket",
    levels: {
      preK: {
        speak: "ROK-it",
        definition: "A big ship that zooms into space.",
        example: "The rocket goes whoosh!",
        tryIt: "Count down 5-4-3-2-1 and ‘blast off’!",
      },
      K: {
        speak: "ROK-it",
        definition: "A vehicle that blasts into space using strong engines.",
        example: "The rocket carried astronauts to orbit.",
        tryIt: "Draw a rocket with a window.",
      },
      G1: {
        speak: "ROK-it",
        definition: "A craft that pushes itself with powerful fuel to reach space.",
        example: "We watched a rocket launch at school.",
        tryIt: "Label the nose, window, and fins.",
      },
    },
  },
  {
    word: "marvelous",
    partOfSpeech: "adjective",
    syllables: 3,
    tags: ["describing"],
    cartoonId: "marvelous",
    levels: {
      preK: {
        speak: "MAR-vuh-luss",
        definition: "Very, very good!",
        example: "Your painting looks marvelous!",
        tryIt: "Say ‘marvelous’ about something you like.",
      },
      K: {
        speak: "MAR-vuh-luss",
        definition: "Something wonderful and special.",
        example: "We had a marvelous picnic at the park.",
        tryIt: "Find one marvelous thing today.",
      },
      G1: {
        speak: "MAR-vuh-luss",
        definition: "Extremely good or delightful.",
        example: "The class did a marvelous job cleaning up.",
        tryIt: "Write or say a ‘marvelous’ sentence.",
      },
    },
  },
  {
    word: "consolidate",
    partOfSpeech: "verb",
    syllables: 4,
    tags: ["actions"],
    cartoonId: "consolidate",
    levels: {
      preK: {
        speak: "kun-SOL-ih-date",
        definition: "Put things together in one place.",
        example: "We put all blocks in one bin.",
        tryIt: "Help move all crayons to one box.",
      },
      K: {
        speak: "kun-SOL-ih-date",
        definition: "To gather many parts and make one group.",
        example: "Let’s consolidate our markers into one container.",
        tryIt: "Sort and group toys that match.",
      },
      G1: {
        speak: "kun-SOL-ih-date",
        definition: "Join smaller pieces to make one stronger or neater whole.",
        example: "We consolidated our notes into a clean page.",
        tryIt: "Combine two piles into one organized pile.",
      },
    },
  },
  {
    word: "puzzle",
    partOfSpeech: "noun",
    syllables: 2,
    tags: ["toys"],
    cartoonId: "puzzle",
    levels: {
      preK: {
        speak: "PUH-zuhl",
        definition: "Pieces you fit together to make a picture.",
        example: "We finished the cat puzzle!",
        tryIt: "Find two pieces that match.",
      },
      K: {
        speak: "PUH-zuhl",
        definition: "A game where you join pieces to solve it.",
        example: "The corner pieces of the puzzle are flat.",
        tryIt: "Sort edge pieces and inside pieces.",
      },
      G1: {
        speak: "PUH-zuhl",
        definition: "Something tricky you solve by thinking or matching.",
        example: "He solved the puzzle by the border first.",
        tryIt: "Explain your puzzle strategy in one sentence.",
      },
    },
  },
];
