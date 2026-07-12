import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  Textarea,
  VStack,
  Heading,
} from "@chakra-ui/react";
import type { LevelId } from "../core/words";
import { FEEDBACK_MAX_LENGTH } from "../core/feedback";
import { submitFeedback } from "../core/submitFeedback";

/**
 * Simple adult gate: asks a basic math question
 * This prevents young children from accidentally submitting feedback
 */
function generateAdultGateQuestion(): { question: string; answer: number } {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return {
    question: `What is ${num1} + ${num2}?`,
    answer: num1 + num2,
  };
}

type Step = "gate" | "form" | "success";

export type FeedbackButtonProps = {
  word: string;
  level: LevelId;
  levelLabel: string;
  /** When false, the button is not shown (word+grade not published in RDS). */
  eligible: boolean;
};

export function FeedbackButton({
  word,
  level,
  levelLabel,
  eligible,
}: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("gate");
  const [gateQuestion, setGateQuestion] = useState(() => generateAdultGateQuestion());
  const [userAnswer, setUserAnswer] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  if (!eligible) {
    return null;
  }

  const resetModal = () => {
    setStep("gate");
    setError(null);
    setUserAnswer("");
    setFeedbackText("");
    setIsBusy(false);
    setGateQuestion(generateAdultGateQuestion());
  };

  const handleOpen = () => {
    resetModal();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetModal();
  };

  const handleVerify = () => {
    setIsBusy(true);
    setError(null);

    const answer = parseInt(userAnswer.trim(), 10);

    if (isNaN(answer)) {
      setError("Please enter a number");
      setIsBusy(false);
      return;
    }

    if (answer !== gateQuestion.answer) {
      setError("Incorrect answer. Please try again.");
      setIsBusy(false);
      return;
    }

    setStep("form");
    setError(null);
    setIsBusy(false);
  };

  const handleSubmit = async () => {
    setIsBusy(true);
    setError(null);

    const trimmed = feedbackText.trim();
    if (!trimmed) {
      setError("Please enter your feedback");
      setIsBusy(false);
      return;
    }

    try {
      await submitFeedback({ word, level, feedback: trimmed });
      setStep("success");
    } catch {
      setError("Please try again");
    } finally {
      setIsBusy(false);
    }
  };

  const handleGateKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  return (
    <>
      <Box position="fixed" bottom={4} right={4} zIndex={1000}>
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
                <Heading size="md">
                  {step === "gate" && "Adult Verification"}
                  {step === "form" && "Share feedback"}
                  {step === "success" && "Thank you"}
                </Heading>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  aria-label="Close"
                >
                  ×
                </Button>
              </Box>

              {step === "gate" && (
                <>
                  <Text>To provide feedback, please answer this question:</Text>
                  <Text fontWeight="semibold" fontSize="lg">
                    {gateQuestion.question}
                  </Text>
                  <Input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleGateKeyPress}
                    placeholder="Enter your answer"
                    autoFocus
                  />
                  {error && <ErrorBanner message={error} />}
                  <Button
                    colorScheme="purple"
                    onClick={handleVerify}
                    loading={isBusy}
                    disabled={!userAnswer.trim()}
                  >
                    Verify
                  </Button>
                </>
              )}

              {step === "form" && (
                <>
                  <Text fontSize="sm" color="gray.600">
                    Feedback for <Text as="span" fontWeight="semibold">{word}</Text>
                    {" · "}
                    <Text as="span" fontWeight="semibold">{levelLabel}</Text>
                  </Text>
                  <Textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="What could we improve about this word?"
                    rows={5}
                    maxLength={FEEDBACK_MAX_LENGTH}
                    autoFocus
                  />
                  <Text fontSize="xs" color="gray.500" textAlign="right">
                    {feedbackText.trim().length}/{FEEDBACK_MAX_LENGTH}
                  </Text>
                  {error && <ErrorBanner message={error} />}
                  <Button
                    colorScheme="purple"
                    onClick={handleSubmit}
                    loading={isBusy}
                    disabled={!feedbackText.trim()}
                  >
                    Submit
                  </Button>
                </>
              )}

              {step === "success" && (
                <>
                  <Text>Thanks — your feedback was saved.</Text>
                  <Button colorScheme="purple" onClick={handleClose}>
                    Done
                  </Button>
                </>
              )}
            </VStack>
          </Box>
        </Box>
      )}
    </>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <Box
      bg="red.50"
      border="1px solid"
      borderColor="red.200"
      color="red.800"
      p={3}
      borderRadius="md"
      fontSize="sm"
    >
      {message}
    </Box>
  );
}
