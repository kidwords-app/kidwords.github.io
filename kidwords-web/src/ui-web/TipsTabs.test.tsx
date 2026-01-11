import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TipsTabs } from './TipsTabs';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>
      {component}
    </ChakraProvider>
  );
};

describe('TipsTabs', () => {
  it('should render without crashing', () => {
    renderWithChakra(<TipsTabs />);
  });

  it('should display all three tab labels', () => {
    renderWithChakra(<TipsTabs />);
    expect(screen.getByText('Teacher Tips')).toBeInTheDocument();
    expect(screen.getByText('Parent Tips')).toBeInTheDocument();
    expect(screen.getByText('About Levels')).toBeInTheDocument();
  });

  it('should display Teacher Tips content by default', () => {
    renderWithChakra(<TipsTabs />);
    expect(screen.getByText(/use gestures/i)).toBeInTheDocument();
  });

  it('should switch to Parent Tips when clicked', async () => {
    const user = userEvent.setup();
    renderWithChakra(<TipsTabs />);
    
    const parentTab = screen.getByText('Parent Tips');
    await user.click(parentTab);
    
    expect(screen.getByText(/show and tell/i)).toBeInTheDocument();
  });

  it('should switch to About Levels when clicked', async () => {
    const user = userEvent.setup();
    renderWithChakra(<TipsTabs />);
    
    const aboutTab = screen.getByText('About Levels');
    await user.click(aboutTab);
    
    expect(screen.getByText(/explanations grow/i)).toBeInTheDocument();
  });
});

