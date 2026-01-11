import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  Heading,
} from "@chakra-ui/react";

/**
 * Simple adult gate: asks a basic math question
 * This prevents young children from accidentally opening email
 */
function generateAdultGateQuestion(): { question: string; answer: number } {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return {
    question: `What is ${num1} + ${num2}?`,
    answer: num1 + num2,
  };
}

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [gateQuestion, setGateQuestion] = useState(() => generateAdultGateQuestion());
  const [userAnswer, setUserAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleOpen = () => {
    setError(null);
    setUserAnswer("");
    setGateQuestion(generateAdultGateQuestion());
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
    setUserAnswer("");
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setError(null);

    const answer = parseInt(userAnswer.trim(), 10);
    
    if (isNaN(answer)) {
      setError("Please enter a number");
      setIsVerifying(false);
      return;
    }

    if (answer !== gateQuestion.answer) {
      setError("Incorrect answer. Please try again.");
      setIsVerifying(false);
      return;
    }

    // Success - open mailto link
    try {
      const subject = encodeURIComponent("Feedback: <enter summary here>");
      const body = encodeURIComponent("Please let us know how KidWords can improve its experience: ");
      const mailtoLink = `mailto:sumita.sami@gmail.com?subject=${subject}&body=${body}`;
      
      window.location.href = mailtoLink;
      handleClose();
    } catch (e) {
      setError("Please try again");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  return (
    <>
      <Box
        position="fixed"
        bottom={4}
        right={4}
        zIndex={1000}
      >
        <Button
          size="sm"
          colorScheme="gray"
          variant="outline"
          onClick={handleOpen}
          fontSize="xs"
          opacity={0.7}
          _hover={{ opacity: 1 }}
        >
          Feedback
        </Button>
      </Box>

      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          zIndex={2000}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={handleClose}
        >
          <Box
            bg="white"
            rounded="2xl"
            shadow="xl"
            p={6}
            maxW="md"
            w="90%"
            onClick={(e) => e.stopPropagation()}
          >
            <VStack gap={4} align="stretch">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Heading size="md">Adult Verification</Heading>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  aria-label="Close"
                >
                  ×
                </Button>
              </Box>
              <Text>
                To provide feedback, please answer this question:
              </Text>
              <Text fontWeight="semibold" fontSize="lg">
                {gateQuestion.question}
              </Text>
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your answer"
                autoFocus
              />
              {error && (
                <Box
                  bg="red.50"
                  border="1px solid"
                  borderColor="red.200"
                  color="red.800"
                  p={3}
                  borderRadius="md"
                  fontSize="sm"
                >
                  {error}
                </Box>
              )}
              <Button
                colorScheme="purple"
                onClick={handleVerify}
                loading={isVerifying}
                disabled={!userAnswer.trim()}
              >
                Verify
              </Button>
            </VStack>
          </Box>
        </Box>
      )}
    </>
  );
}

