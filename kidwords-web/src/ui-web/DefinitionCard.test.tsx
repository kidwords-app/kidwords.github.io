import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DefinitionCard } from './DefinitionCard';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { WORDS, type LevelId } from '../core/words';

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>
      {component}
    </ChakraProvider>
  );
};

describe('DefinitionCard', () => {
  const word = WORDS[0]; // Use first word for testing
  const level: LevelId = 'K';

  it('should render without crashing', () => {
    renderWithChakra(<DefinitionCard word={word} level={level} />);
  });

  it('should display the word name', () => {
    renderWithChakra(<DefinitionCard word={word} level={level} />);
    expect(screen.getByText(word.word, { exact: false })).toBeInTheDocument();
  });

  it('should display part of speech', () => {
    renderWithChakra(<DefinitionCard word={word} level={level} />);
    expect(screen.getByText(word.partOfSpeech)).toBeInTheDocument();
  });

  it('should display syllables count', () => {
    renderWithChakra(<DefinitionCard word={word} level={level} />);
    expect(screen.getByText(new RegExp(`${word.syllables}.*syllable`, 'i'))).toBeInTheDocument();
  });

  it('should display pronunciation for the selected level', () => {
    renderWithChakra(<DefinitionCard word={word} level={level} />);
    const levelCopy = word.levels[level];
    expect(screen.getByText(levelCopy.speak, { exact: false })).toBeInTheDocument();
  });

  it('should display definition for the selected level', () => {
    renderWithChakra(<DefinitionCard word={word} level={level} />);
    const levelCopy = word.levels[level];
    expect(screen.getByText(levelCopy.definition)).toBeInTheDocument();
  });

  it('should display example for the selected level', () => {
    renderWithChakra(<DefinitionCard word={word} level={level} />);
    const levelCopy = word.levels[level];
    expect(screen.getByText(levelCopy.example, { exact: false })).toBeInTheDocument();
  });

  it('should display tryIt for the selected level', () => {
    renderWithChakra(<DefinitionCard word={word} level={level} />);
    const levelCopy = word.levels[level];
    expect(screen.getByText(levelCopy.tryIt)).toBeInTheDocument();
  });

  it('should display all tags', () => {
    renderWithChakra(<DefinitionCard word={word} level={level} />);
    word.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('should display different content for different levels', () => {
    const { rerender } = renderWithChakra(<DefinitionCard word={word} level="preK" />);
    const preKDefinition = word.levels.preK.definition;
    expect(screen.getByText(preKDefinition)).toBeInTheDocument();

    rerender(
      <ChakraProvider value={defaultSystem}>
        <DefinitionCard word={word} level="G1" />
      </ChakraProvider>
    );
    const g1Definition = word.levels.G1.definition;
    expect(screen.getByText(g1Definition)).toBeInTheDocument();
  });

  it('should render image with correct src', () => {
    renderWithChakra(<DefinitionCard word={word} level={level} />);
    const image = screen.getByAltText(new RegExp(word.word, 'i')) as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain(`/cartoons/${word.cartoonId}.png`);
  });
});

