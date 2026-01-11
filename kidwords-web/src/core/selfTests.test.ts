import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runSelfTests } from './selfTests';
import { WORDS, LEVELS } from './words';

describe('runSelfTests', () => {
  let consoleAssertSpy: any;

  beforeEach(() => {
    // Mock console.assert to track calls
    consoleAssertSpy = vi.spyOn(console, 'assert').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should run without throwing errors for valid data', () => {
    expect(() => runSelfTests()).not.toThrow();
  });

  it('should verify all words have all levels', () => {
    runSelfTests();
    
    // Should not have any assertion failures
    const failedAssertions = consoleAssertSpy.mock.calls.filter(
      (call: any[]) => call[0] === false
    );
    expect(failedAssertions.length).toBe(0);
  });

  it('should verify all words have cartoonId', () => {
    runSelfTests();
    
    // Should have at least one assertion checking cartoonId
    expect(consoleAssertSpy).toHaveBeenCalled();
  });

  it('should verify normalize function works correctly', () => {
    runSelfTests();
    
    // Check that normalize assertion was made
    const normalizeAssertions = consoleAssertSpy.mock.calls.filter(
      (call: any[]) => typeof call[1] === 'string' && call[1].includes('normalize')
    );
    expect(normalizeAssertions.length).toBeGreaterThan(0);
  });

  it('should complete all validation checks', () => {
    runSelfTests();
    
    // Should have made multiple assertions
    expect(consoleAssertSpy).toHaveBeenCalled();
    
    // Count expected assertions:
    // - One per word per level (WORDS.length * LEVELS.length)
    // - One per word for cartoonId (WORDS.length)
    // - One for normalize test
    const expectedMinAssertions = WORDS.length * (LEVELS.length + 1) + 1;
    expect(consoleAssertSpy.mock.calls.length).toBeGreaterThanOrEqual(expectedMinAssertions);
  });
});

