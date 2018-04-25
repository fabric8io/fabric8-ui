import {
  fromOrdinal,
  MemoryUnit,
  ordinal
} from './memory-unit';

describe('MemoryUnit', () => {
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

  describe('fromOrdinal', () => {
    it('should be B for 0', () => {
      expect(fromOrdinal(0)).toEqual(MemoryUnit.B);
    });

    it('should be KB for 1', () => {
      expect(fromOrdinal(1)).toEqual(MemoryUnit.KB);
    });

    it('should be MB for 2', () => {
      expect(fromOrdinal(2)).toEqual(MemoryUnit.MB);
    });

    it('should be GB for 3', () => {
      expect(fromOrdinal(3)).toEqual(MemoryUnit.GB);
    });

    describe('undefined cases', () => {
      [-1, Object.keys(MemoryUnit).length, 1.5, NaN, Infinity].forEach((n: number): void => {
        it(`should be undefined for ${n}`, () => {
          expect(fromOrdinal(n)).toBeUndefined();
        });
      });
    });
  });
});
