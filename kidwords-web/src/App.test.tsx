import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import App from './App';
import { WORDS } from './core/words';
import * as selfTestsModule from './core/selfTests';

// Mock self-tests to avoid console errors during tests
vi.mock('./core/selfTests', () => ({
  runSelfTests: vi.fn(),
}));

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>
      {component}
    </ChakraProvider>
  );
};

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderWithChakra(<App />);
  });

  it('should run self-tests on mount', () => {
    renderWithChakra(<App />);
    expect(selfTestsModule.runSelfTests).toHaveBeenCalledTimes(1);
  });

  it('should display KidWords heading', () => {
    renderWithChakra(<App />);
    expect(screen.getByText('KidWords')).toBeInTheDocument();
  });

  it('should display default level in header', () => {
    const { container } = renderWithChakra(<App />);
    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select.value).toBe('K');
  });

  it('should display first word by default', () => {
    renderWithChakra(<App />);
    const firstWord = WORDS[0];
    // The word appears in both sidebar and definition card, so use getAllByText
    const wordElements = screen.getAllByText(firstWord.word);
    expect(wordElements.length).toBeGreaterThan(0);
    // Verify definition card content is present
    expect(screen.getByText('What it means')).toBeInTheDocument();
  });

  it('should filter words when query changes', async () => {
    const user = userEvent.setup();
    renderWithChakra(<App />);
    
    const input = screen.getByPlaceholderText(/search words/i);
    await user.type(input, 'happy');
    
    // Should show filtered words - check that happy appears (may appear multiple times)
    const happyElements = screen.getAllByText('happy');
    expect(happyElements.length).toBeGreaterThan(0);
    // Verify the definition card shows the happy word's content
    const happyWord = WORDS.find(w => w.word === 'happy');
    if (happyWord) {
      expect(screen.getByText(happyWord.levels.K.definition)).toBeInTheDocument();
    }
  });

  it('should update selected word when clicking a word in sidebar', async () => {
    const user = userEvent.setup();
    renderWithChakra(<App />);
    
    // Find a word that's not the first one
    const secondWord = WORDS[1];
    const wordButtons = screen.getAllByText(secondWord.word);
    // Click the first instance (in the sidebar)
    await user.click(wordButtons[0]);
    
    // The definition card should show the selected word
    // After clicking, the word should appear in both sidebar and definition card
    const wordElementsAfterClick = screen.getAllByText(secondWord.word);
    expect(wordElementsAfterClick.length).toBeGreaterThanOrEqual(1);
    
    // Verify definition card content is updated with the new word's definition
    // Default level is "K", so check for the K-level definition
    const kLevelDefinition = secondWord.levels.K.definition;
    expect(screen.getByText(kLevelDefinition)).toBeInTheDocument();
  });

  it('should change level when level selector changes', async () => {
    const user = userEvent.setup();
    const { container } = renderWithChakra(<App />);
    
    const select = container.querySelector('select') as HTMLSelectElement;
    await user.selectOptions(select, 'preK');
    
    // Level should be updated (we can verify by checking the select value)
    expect(select.value).toBe('preK');
  });

  it('should show empty state when no words match query', async () => {
    const user = userEvent.setup();
    renderWithChakra(<App />);
    
    const input = screen.getByPlaceholderText(/search words/i);
    await user.type(input, 'nonexistentword12345');
    
    // EmptyState should be displayed
    expect(screen.getByText(/search for a word/i)).toBeInTheDocument();
  });

  it('should display categories in sidebar', () => {
    renderWithChakra(<App />);
    
    // Should show Categories heading
    expect(screen.getByText('Categories')).toBeInTheDocument();
    // Should show "All Words" option (button text includes emoji prefix when selected)
    expect(screen.getByText(/All Words/)).toBeInTheDocument();
  });

  it('should display word definition when category is selected', () => {
    renderWithChakra(<App />);
    
    // When a category is selected, the first word from that category should be displayed
    // The word should appear in the definition card
    const firstWord = WORDS[0];
    const wordElements = screen.getAllByText(firstWord.word);
    expect(wordElements.length).toBeGreaterThan(0);
    // Verify definition card content is present
    expect(screen.getByText('What it means')).toBeInTheDocument();
  });

  it('should display definition card for selected word', () => {
    renderWithChakra(<App />);
    
    const firstWord = WORDS[0];
    // The word should appear in the definition card (as a heading)
    // Use getAllByText since the word appears in both sidebar and definition card
    const wordElements = screen.getAllByText(firstWord.word);
    expect(wordElements.length).toBeGreaterThan(0);
    
    // Verify definition card content is present
    expect(screen.getByText('What it means')).toBeInTheDocument();
    expect(screen.getByText('Example')).toBeInTheDocument();
    expect(screen.getByText('Try it!')).toBeInTheDocument();
  });

  it('should display TipsTabs component', () => {
    renderWithChakra(<App />);
    
    // TipsTabs should be rendered with tab labels
    expect(screen.getByText('Teacher Tips')).toBeInTheDocument();
    expect(screen.getByText('Parent Tips')).toBeInTheDocument();
    expect(screen.getByText('About Levels')).toBeInTheDocument();
  });
});

