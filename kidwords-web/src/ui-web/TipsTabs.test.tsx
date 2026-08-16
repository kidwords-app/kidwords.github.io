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

  it('should start collapsed with a tips header', () => {
    renderWithChakra(<TipsTabs />);
    expect(screen.getByRole('button', { name: /Tips & help/i })).toBeInTheDocument();
    expect(screen.queryByText(/use gestures/i)).not.toBeInTheDocument();
  });

  it('should display all three tab labels when expanded', async () => {
    const user = userEvent.setup();
    renderWithChakra(<TipsTabs />);

    await user.click(screen.getByRole('button', { name: /Tips & help/i }));

    expect(screen.getByText('Teacher Tips')).toBeInTheDocument();
    expect(screen.getByText('Parent Tips')).toBeInTheDocument();
    expect(screen.getByText('About Levels')).toBeInTheDocument();
  });

  it('should display Teacher Tips content when expanded', async () => {
    const user = userEvent.setup();
    renderWithChakra(<TipsTabs />);

    await user.click(screen.getByRole('button', { name: /Tips & help/i }));

    expect(screen.getByText(/use gestures/i)).toBeInTheDocument();
  });

  it('should switch to Parent Tips when clicked', async () => {
    const user = userEvent.setup();
    renderWithChakra(<TipsTabs />);

    await user.click(screen.getByRole('button', { name: /Tips & help/i }));
    await user.click(screen.getByText('Parent Tips'));
    
    expect(screen.getByText(/show and tell/i)).toBeInTheDocument();
  });

  it('should switch to About Levels when clicked', async () => {
    const user = userEvent.setup();
    renderWithChakra(<TipsTabs />);

    await user.click(screen.getByRole('button', { name: /Tips & help/i }));
    await user.click(screen.getByText('About Levels'));
    
    expect(screen.getByText(/explanations grow/i)).toBeInTheDocument();
  });
});

