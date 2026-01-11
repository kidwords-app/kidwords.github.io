import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>
      {component}
    </ChakraProvider>
  );
};

describe('EmptyState', () => {
  it('should render without crashing', () => {
    renderWithChakra(<EmptyState />);
  });

  it('should display empty state message', () => {
    renderWithChakra(<EmptyState />);
    expect(screen.getByText(/search for a word/i)).toBeInTheDocument();
    expect(screen.getByText(/try words like/i)).toBeInTheDocument();
  });
});

