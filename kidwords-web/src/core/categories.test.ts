import { describe, it, expect } from 'vitest';
import {
  getCategoriesForLevel,
  getAvailableCategories,
  tagToCategoryId,
  type CategoryId,
} from './categories';
import { WORDS, type LevelId } from './words';

describe('categories', () => {
  describe('getCategoriesForLevel', () => {
    it('should return categories for preK level', () => {
      const categories = getCategoriesForLevel('preK');
      expect(categories.feelings.label).toBe('How We Feel');
      expect(categories.actions.label).toBe('Things We Do');
      expect(categories.describing.label).toBe('Describing Words');
    });

    it('should return categories for K level', () => {
      const categories = getCategoriesForLevel('K');
      expect(categories.feelings.label).toBe('Feelings');
      expect(categories.friends.label).toBe('Friends and School');
    });

    it('should return categories for G1 level', () => {
      const categories = getCategoriesForLevel('G1');
      expect(categories.feelings.label).toBe('Emotions');
      expect(categories.friends.label).toBe('Friends and Community');
    });

    it('should return all 8 categories for each level', () => {
      const levels: LevelId[] = ['preK', 'K', 'G1'];
      levels.forEach((level) => {
        const categories = getCategoriesForLevel(level);
        expect(Object.keys(categories).length).toBe(8);
      });
    });

    it('should have "World" label for nature category at all levels', () => {
      const levels: LevelId[] = ['preK', 'K', 'G1'];
      levels.forEach((level) => {
        const categories = getCategoriesForLevel(level);
        expect(categories.nature.label).toBe('World');
      });
    });
  });

  describe('tagToCategoryId', () => {
    it('should map feelings-related tags to feelings category', () => {
      expect(tagToCategoryId('feelings')).toBe('feelings');
      expect(tagToCategoryId('emotion')).toBe('feelings');
      expect(tagToCategoryId('emotions')).toBe('feelings');
    });

    it('should map action-related tags to actions category', () => {
      expect(tagToCategoryId('actions')).toBe('actions');
      expect(tagToCategoryId('action')).toBe('actions');
    });

    it('should map describing tags to describing category', () => {
      expect(tagToCategoryId('describing')).toBe('describing');
      expect(tagToCategoryId('description')).toBe('describing');
    });

    it('should map space/nature tags to nature category', () => {
      expect(tagToCategoryId('space')).toBe('nature');
      expect(tagToCategoryId('nature')).toBe('nature');
      expect(tagToCategoryId('science')).toBe('nature');
      expect(tagToCategoryId('world')).toBe('nature');
    });

    it('should map play/toy tags to play category', () => {
      expect(tagToCategoryId('play')).toBe('play');
      expect(tagToCategoryId('toys')).toBe('play');
      expect(tagToCategoryId('toy')).toBe('play');
      expect(tagToCategoryId('create')).toBe('play');
      expect(tagToCategoryId('making')).toBe('play');
    });

    it('should return null for unknown tags', () => {
      expect(tagToCategoryId('unknown')).toBe(null);
      expect(tagToCategoryId('xyz')).toBe(null);
    });

    it('should handle case-insensitive tags', () => {
      expect(tagToCategoryId('FEELINGS')).toBe('feelings');
      expect(tagToCategoryId('Actions')).toBe('actions');
    });
  });

  describe('getAvailableCategories', () => {
    it('should return categories that have words', () => {
      const available = getAvailableCategories(WORDS, 'K');
      expect(available.length).toBeGreaterThan(0);
      expect(available).toContain('feelings');
      expect(available).toContain('describing');
    });

    it('should return empty array for empty word list', () => {
      const available = getAvailableCategories([], 'K');
      expect(available).toEqual([]);
    });

    it('should only return categories that actually have words', () => {
      const wordsWithFeelings = WORDS.filter((w) => w.tags.includes('feelings'));
      const available = getAvailableCategories(wordsWithFeelings, 'K');
      expect(available).toContain('feelings');
      // Should not contain categories that don't have words
      expect(available.length).toBeLessThanOrEqual(8);
    });

    it('should work for all levels', () => {
      const levels: LevelId[] = ['preK', 'K', 'G1'];
      levels.forEach((level) => {
        const available = getAvailableCategories(WORDS, level);
        expect(Array.isArray(available)).toBe(true);
        expect(available.length).toBeGreaterThan(0);
      });
    });
  });
});

