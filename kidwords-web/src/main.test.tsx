import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock ReactDOM to prevent DOM errors during import
const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({
  render: mockRender,
}));

vi.mock('react-dom/client', () => ({
  default: {
    createRoot: mockCreateRoot,
  },
}));

// main.tsx is an entry point file that sets up ReactDOM and ChakraProvider.
// The actual component logic and provider setup are tested in App.test.tsx.
// This test simply verifies the file can be imported without syntax errors.
describe('main.tsx', () => {
  beforeEach(() => {
    // Create a mock root element before importing
    if (!document.getElementById('root')) {
      const rootElement = document.createElement('div');
      rootElement.id = 'root';
      document.body.appendChild(rootElement);
    }
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.remove();
    }
  });

  it('should be importable without errors', async () => {
    // This test verifies the file has no syntax errors and can be imported
    // The mock will prevent actual DOM rendering
    await expect(import('./main')).resolves.toBeDefined();
    // Verify that createRoot was called (proving the code executed)
    expect(mockCreateRoot).toHaveBeenCalled();
  });
});

