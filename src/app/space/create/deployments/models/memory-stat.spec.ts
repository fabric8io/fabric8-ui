import {
  MemoryUnit,
  ordinal
} from './memory-stat';

describe('MemoryStat', () => {
  describe('ordinal', () => {
    it('should be 0 for B', () => {
      expect(ordinal(MemoryUnit.B)).toBe(0);
    });

    it('should be 1 for KB', () => {
      expect(ordinal(MemoryUnit.KB)).toBe(1);
    });

    it('should be 2 for MB', () => {
      expect(ordinal(MemoryUnit.MB)).toBe(2);
    });

    it('should be 3 for GB', () => {
      expect(ordinal(MemoryUnit.GB)).toBe(3);
    });
  });
});
