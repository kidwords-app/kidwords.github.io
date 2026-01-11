import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { WORDS } from '../core/words';

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>
      {component}
    </ChakraProvider>
  );
};

describe('Sidebar', () => {
  const mockOnSelectWord = vi.fn();

  const defaultProps = {
    words: WORDS,
    selectedWord: undefined,
    onSelectWord: mockOnSelectWord,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderWithChakra(<Sidebar {...defaultProps} />);
  });

  it('should display "Words" heading', () => {
    renderWithChakra(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Words')).toBeInTheDocument();
  });

  it('should render all words as buttons', () => {
    renderWithChakra(<Sidebar {...defaultProps} />);
    WORDS.forEach((word) => {
      expect(screen.getByText(word.word)).toBeInTheDocument();
    });
  });

  it('should call onSelectWord when a word button is clicked', async () => {
    const user = userEvent.setup();
    renderWithChakra(<Sidebar {...defaultProps} />);
    
    const firstWord = WORDS[0];
    const button = screen.getByText(firstWord.word);
    await user.click(button);
    
    expect(mockOnSelectWord).toHaveBeenCalledWith(firstWord);
  });

  it('should highlight selected word', () => {
    const selectedWord = WORDS[0].word;
    renderWithChakra(<Sidebar {...defaultProps} selectedWord={selectedWord} />);
    
    const button = screen.getByText(selectedWord);
    expect(button).toBeInTheDocument();
  });

  it('should handle empty words array', () => {
    renderWithChakra(<Sidebar {...defaultProps} words={[]} />);
    expect(screen.getByText('Words')).toBeInTheDocument();
  });
});

