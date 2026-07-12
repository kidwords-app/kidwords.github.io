import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWords } from './useWords';
import * as fetchWordsModule from './fetchWords';
import { WORDS, applyDbWords } from './words';

describe('useWords', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with bundled words immediately', () => {
    const { result } = renderHook(() => useWords());
    expect(result.current.words).toEqual(WORDS);
  });

  it('overlays dbFetch words when the API succeeds', async () => {
    const fromDb = [{ ...WORDS[0], syllables: 99 }];
    vi.spyOn(fetchWordsModule, 'fetchWords').mockResolvedValue(fromDb);

    const { result } = renderHook(() => useWords());

    await waitFor(() => {
      expect(result.current.dbSyncing).toBe(false);
    });

    expect(result.current.words).toEqual(applyDbWords(WORDS, fromDb));
    expect(result.current.dbError).toBeNull();
  });

  it('keeps bundled words when the API fails', async () => {
    vi.spyOn(fetchWordsModule, 'fetchWords').mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useWords());

    await waitFor(() => {
      expect(result.current.dbSyncing).toBe(false);
    });

    expect(result.current.words).toEqual(WORDS);
    expect(result.current.dbError).toBe('network');
  });
});
