import { useState } from "react";
import {
  Box,
  Button,
  CollapsibleContent,
  CollapsibleIndicator,
  CollapsibleRoot,
  CollapsibleTrigger,
  Text,
  VStack,
} from "@chakra-ui/react";

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
    <CollapsibleRoot defaultOpen={false} lazyMount unmountOnExit>
      <Box bg="white" rounded="2xl" shadow="sm" p={4}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            width="full"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={3}
            px={2}
            py={3}
            height="auto"
            fontWeight="semibold"
            color="gray.700"
            _hover={{ bg: "purple.50" }}
          >
            <Text fontSize="md" lineHeight="short" textAlign="left">
              <Text as="span" fontWeight="semibold">
                Tips & help
              </Text>
              <Text as="span" color="gray.500" fontSize="sm" fontWeight="normal" ml={2}>
                for teachers and parents
              </Text>
            </Text>
            <CollapsibleIndicator
              color="gray.500"
              flexShrink={0}
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              boxSize={5}
              fontSize="xs"
              lineHeight="1"
            >
              ▼
            </CollapsibleIndicator>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Box display="flex" gap={2} mt={2} mb={4} borderBottom="1px solid" borderColor="gray.200">
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
        </CollapsibleContent>
      </Box>
    </CollapsibleRoot>
  );
}
