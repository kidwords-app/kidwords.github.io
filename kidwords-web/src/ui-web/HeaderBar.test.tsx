import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeaderBar } from './HeaderBar';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { LEVELS, type LevelId } from '../core/words';

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>
      {component}
    </ChakraProvider>
  );
};

describe('HeaderBar', () => {
  const mockOnLevelChange = vi.fn();
  const mockOnQueryChange = vi.fn();

  const defaultProps = {
    level: 'K' as LevelId,
    levels: LEVELS,
    query: '',
    onLevelChange: mockOnLevelChange,
    onQueryChange: mockOnQueryChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderWithChakra(<HeaderBar {...defaultProps} />);
  });

  it('should display KidWords heading', () => {
    renderWithChakra(<HeaderBar {...defaultProps} />);
    expect(screen.getByText('KidWords')).toBeInTheDocument();
  });

  it('should display subtitle', () => {
    renderWithChakra(<HeaderBar {...defaultProps} />);
    expect(screen.getByText(/friendly explanations/i)).toBeInTheDocument();
  });

  it('should render search input', () => {
    renderWithChakra(<HeaderBar {...defaultProps} />);
    const input = screen.getByPlaceholderText(/search words/i);
    expect(input).toBeInTheDocument();
  });

  it('should display current query in input', () => {
    renderWithChakra(<HeaderBar {...defaultProps} query="test" />);
    const input = screen.getByPlaceholderText(/search words/i) as HTMLInputElement;
    expect(input.value).toBe('test');
  });

  it('should call onQueryChange when input changes', async () => {
    const user = userEvent.setup();
    renderWithChakra(<HeaderBar {...defaultProps} />);
    const input = screen.getByPlaceholderText(/search words/i);
    
    await user.type(input, 'test');
    expect(mockOnQueryChange).toHaveBeenCalled();
  });

  it('should render level select dropdown', () => {
    const { container } = renderWithChakra(<HeaderBar {...defaultProps} />);
    const select = container.querySelector('select');
    expect(select).toBeInTheDocument();
  });

  it('should display all level options', () => {
    renderWithChakra(<HeaderBar {...defaultProps} />);
    LEVELS.forEach((level) => {
      expect(screen.getByText(level.label)).toBeInTheDocument();
    });
  });

  it('should call onLevelChange when level changes', async () => {
    const user = userEvent.setup();
    const { container } = renderWithChakra(<HeaderBar {...defaultProps} />);
    const select = container.querySelector('select') as HTMLSelectElement;
    
    expect(select).toBeInTheDocument();
    await user.selectOptions(select, 'preK');
    expect(mockOnLevelChange).toHaveBeenCalledWith('preK');
  });
});

