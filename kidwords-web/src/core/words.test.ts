import { describe, it, expect } from 'vitest';
import { WORDS, LEVELS, type WordEntry, type LevelId } from './words';

describe('WORDS data structure', () => {
  it('should have at least one word', () => {
    expect(WORDS.length).toBeGreaterThan(0);
  });

  it('should have all required fields for each word', () => {
    WORDS.forEach((word) => {
      expect(word).toHaveProperty('word');
      expect(word).toHaveProperty('partOfSpeech');
      expect(word).toHaveProperty('syllables');
      expect(word).toHaveProperty('tags');
      expect(word).toHaveProperty('cartoonId');
      expect(word).toHaveProperty('levels');
      
      expect(typeof word.word).toBe('string');
      expect(word.word.length).toBeGreaterThan(0);
      expect(typeof word.partOfSpeech).toBe('string');
      expect(typeof word.syllables).toBe('number');
      expect(Array.isArray(word.tags)).toBe(true);
      expect(typeof word.cartoonId).toBe('string');
      expect(typeof word.levels).toBe('object');
    });
  });

  it('should have all three levels for each word', () => {
    const levelIds: LevelId[] = ['preK', 'K', 'G1'];
    
    WORDS.forEach((word) => {
      levelIds.forEach((levelId) => {
        expect(word.levels).toHaveProperty(levelId);
        const levelCopy = word.levels[levelId];
        expect(levelCopy).toHaveProperty('speak');
        expect(levelCopy).toHaveProperty('definition');
        expect(levelCopy).toHaveProperty('example');
        expect(levelCopy).toHaveProperty('tryIt');
        
        expect(typeof levelCopy.speak).toBe('string');
        expect(typeof levelCopy.definition).toBe('string');
        expect(typeof levelCopy.example).toBe('string');
        expect(typeof levelCopy.tryIt).toBe('string');
        
        expect(levelCopy.speak.length).toBeGreaterThan(0);
        expect(levelCopy.definition.length).toBeGreaterThan(0);
        expect(levelCopy.example.length).toBeGreaterThan(0);
        expect(levelCopy.tryIt.length).toBeGreaterThan(0);
      });
    });
  });

  it('should have valid syllables count', () => {
    WORDS.forEach((word) => {
      expect(word.syllables).toBeGreaterThan(0);
      expect(word.syllables).toBeLessThanOrEqual(10); // reasonable upper bound
    });
  });

  it('should have at least one tag per word', () => {
    WORDS.forEach((word) => {
      expect(word.tags.length).toBeGreaterThan(0);
      word.tags.forEach((tag) => {
        expect(typeof tag).toBe('string');
        expect(tag.length).toBeGreaterThan(0);
      });
    });
  });

  it('should have unique words', () => {
    const words = WORDS.map(w => w.word.toLowerCase());
    const uniqueWords = new Set(words);
    expect(uniqueWords.size).toBe(WORDS.length);
  });

  it('should have non-empty cartoonId', () => {
    WORDS.forEach((word) => {
      expect(word.cartoonId.length).toBeGreaterThan(0);
    });
  });
});

describe('LEVELS constant', () => {
  it('should have exactly 3 levels', () => {
    expect(LEVELS).toHaveLength(3);
  });

  it('should have all required fields for each level', () => {
    LEVELS.forEach((level) => {
      expect(level).toHaveProperty('id');
      expect(level).toHaveProperty('label');
      expect(typeof level.id).toBe('string');
      expect(typeof level.label).toBe('string');
      expect(level.label.length).toBeGreaterThan(0);
    });
  });

  it('should have unique level ids', () => {
    const ids = LEVELS.map(l => l.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(LEVELS.length);
  });

  it('should have valid level ids', () => {
    const validIds: LevelId[] = ['preK', 'K', 'G1'];
    LEVELS.forEach((level) => {
      expect(validIds).toContain(level.id);
    });
  });
});

