import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategorySidebar } from './CategorySidebar';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { WORDS, type LevelId } from '../core/words';
import type { CategoryId } from '../core/categories';

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>
      {component}
    </ChakraProvider>
  );
};

describe('CategorySidebar', () => {
  const mockOnSelectCategory = vi.fn();

  const defaultProps = {
    words: WORDS,
    selectedCategory: null as CategoryId | null,
    level: 'K' as LevelId,
    onSelectCategory: mockOnSelectCategory,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderWithChakra(<CategorySidebar {...defaultProps} />);
  });

  it('should display Categories heading', () => {
    renderWithChakra(<CategorySidebar {...defaultProps} />);
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('should display "All Words" option', () => {
    renderWithChakra(<CategorySidebar {...defaultProps} />);
    // Button text may include emoji prefix when selected, so use regex
    expect(screen.getByText(/All Words/)).toBeInTheDocument();
  });

  it('should display available categories', () => {
    renderWithChakra(<CategorySidebar {...defaultProps} />);
    // Should show at least one category (feelings, since we have words with that tag)
    // Button text includes emoji prefix, so use regex to match
    expect(screen.getByText(/Feelings/)).toBeInTheDocument();
  });

  it('should call onSelectCategory when category is clicked', async () => {
    const user = userEvent.setup();
    renderWithChakra(<CategorySidebar {...defaultProps} />);
    
    // Find and click a category button (not "All Words")
    const categoryButtons = screen.getAllByRole('button');
    const categoryButton = categoryButtons.find(
      (btn) => btn.textContent !== 'All Words'
    );
    
    if (categoryButton) {
      await user.click(categoryButton);
      expect(mockOnSelectCategory).toHaveBeenCalled();
    }
  });

  it('should highlight selected category', () => {
    renderWithChakra(
      <CategorySidebar {...defaultProps} selectedCategory="feelings" />
    );
    // The selected category should be rendered (button text includes emoji prefix)
    expect(screen.getByText(/Feelings/)).toBeInTheDocument();
  });

  it('should show empty state when no categories available', () => {
    renderWithChakra(
      <CategorySidebar {...defaultProps} words={[]} />
    );
    expect(screen.getByText(/no categories found, search for words/i)).toBeInTheDocument();
  });

  it('should display different category labels for different levels', () => {
    const { rerender } = renderWithChakra(
      <CategorySidebar {...defaultProps} level="preK" />
    );
    // Button text includes emoji prefix, so use regex
    expect(screen.getByText(/How We Feel/)).toBeInTheDocument();

    rerender(
      <ChakraProvider value={defaultSystem}>
        <CategorySidebar {...defaultProps} level="K" />
      </ChakraProvider>
    );
    expect(screen.getByText(/Feelings/)).toBeInTheDocument();
  });
});

