import { useState } from "react";
import { Box, Button, Text, VStack } from "@chakra-ui/react";

export function TipsTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: "Teacher Tips",
      content: (
        <VStack align="stretch" gap={2}>
          <Text>• Use gestures, pictures, and short sentences for Pre-K.</Text>
          <Text>• In Kindergarten, connect to routines (clean up, share).</Text>
          <Text>• In 1st Grade, add simple reasons and mini-challenges.</Text>
        </VStack>
      ),
    },
    {
      label: "Parent Tips",
      content: (
        <Text>Try "show and tell": show the word card, tell a story sentence, and let your child act it out.</Text>
      ),
    },
    {
      label: "About Levels",
      content: (
        <Text>Explanations grow with your child: more context, richer examples, and tiny prompts to practice.</Text>
      ),
    },
  ];

  return (
    <Box bg="white" rounded="2xl" shadow="sm" p={4}>
      <Box display="flex" gap={2} mb={4} borderBottom="1px solid" borderColor="gray.200">
        {tabs.map((tab, index) => (
          <Button
            key={index}
            variant={activeTab === index ? "solid" : "ghost"}
            colorScheme="purple"
            size="sm"
            onClick={() => setActiveTab(index)}
            borderRadius="md"
            borderBottomRadius="none"
            borderBottom={activeTab === index ? "2px solid" : "2px solid transparent"}
            borderColor={activeTab === index ? "purple.500" : "transparent"}
          >
            {tab.label}
          </Button>
        ))}
      </Box>
      <Box>{tabs[activeTab].content}</Box>
    </Box>
  );
}
