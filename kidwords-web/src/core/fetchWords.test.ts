import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchWords } from './fetchWords';

describe('fetchWords', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns parsed words from the API', async () => {
    const payload = [{ word: 'test', partOfSpeech: 'noun', syllables: 1, tags: ['a'], cartoonId: 'test', levels: {} }];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(payload),
      })
    );

    await expect(fetchWords()).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith('/api/words', { cache: 'no-store' });
  });

  it('throws when the API response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    );

    await expect(fetchWords()).rejects.toThrow('Failed to load words (500)');
  });
});
