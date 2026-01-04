import { describe, it, expect } from 'vitest';
import { normalize, filterWords } from './search';
import { WORDS, type WordEntry } from './words';

describe('normalize', () => {
  it('should convert to lowercase', () => {
    expect(normalize('HELLO')).toBe('hello');
  });

  it('should remove punctuation', () => {
    expect(normalize('Hello, World!')).toBe('hello world');
  });

  it('should normalize unicode characters', () => {
    expect(normalize('Café')).toBe('cafe');
    expect(normalize('naïve')).toBe('naive');
  });

  it('should remove special characters but keep spaces and hyphens', () => {
    expect(normalize('hello-world')).toBe('hello-world');
    expect(normalize('hello@world#test')).toBe('hello world test');
  });

  it('should trim whitespace', () => {
    expect(normalize('  hello  ')).toBe('hello');
  });

  it('should handle empty strings', () => {
    expect(normalize('')).toBe('');
  });

  it('should handle strings with only special characters', () => {
    expect(normalize('!!!@@@###')).toBe('');
  });
});

describe('filterWords', () => {
  it('should return all words when query is empty', () => {
    const result = filterWords(WORDS, '');
    expect(result).toHaveLength(WORDS.length);
  });

  it('should filter by word name', () => {
    const result = filterWords(WORDS, 'happy');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].word).toBe('happy');
  });

  it('should filter by part of speech', () => {
    const result = filterWords(WORDS, 'noun');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(w => w.partOfSpeech === 'noun')).toBe(true);
  });

  it('should filter by tags', () => {
    const result = filterWords(WORDS, 'feelings');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(w => w.tags.includes('feelings'))).toBe(true);
  });

  it('should be case insensitive', () => {
    const result1 = filterWords(WORDS, 'HAPPY');
    const result2 = filterWords(WORDS, 'happy');
    expect(result1).toEqual(result2);
  });

  it('should handle partial matches', () => {
    const result = filterWords(WORDS, 'hap');
    expect(result.some(w => w.word === 'happy')).toBe(true);
  });

  it('should return empty array for no matches', () => {
    const result = filterWords(WORDS, 'nonexistentword123');
    expect(result).toHaveLength(0);
  });

  it('should sort results alphabetically by word', () => {
    const result = filterWords(WORDS, '');
    for (let i = 1; i < result.length; i++) {
      expect(result[i].word.localeCompare(result[i - 1].word)).toBeGreaterThanOrEqual(0);
    }
  });

  it('should handle special characters in query', () => {
    const result = filterWords(WORDS, 'empathy!');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].word).toBe('empathy');
  });
});

