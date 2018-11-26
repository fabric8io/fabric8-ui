import {
  fromOrdinal,
  MemoryUnit,
  ordinal
} from './memory-unit';

describe('MemoryUnit', (): void => {
  describe('ordinal', (): void => {
    it('should be 0 for B', (): void => {
      expect(ordinal(MemoryUnit.B)).toBe(0);
    });

    it('should be 1 for KB', (): void => {
      expect(ordinal(MemoryUnit.KB)).toBe(1);
    });

    it('should be 2 for MB', (): void => {
      expect(ordinal(MemoryUnit.MB)).toBe(2);
    });

    it('should be 3 for GB', (): void => {
      expect(ordinal(MemoryUnit.GB)).toBe(3);
    });
  });

  describe('fromOrdinal', (): void => {
    it('should be B for 0', (): void => {
      expect(fromOrdinal(0)).toEqual(MemoryUnit.B);
    });

    it('should be KB for 1', (): void => {
      expect(fromOrdinal(1)).toEqual(MemoryUnit.KB);
    });

    it('should be MB for 2', (): void => {
      expect(fromOrdinal(2)).toEqual(MemoryUnit.MB);
    });

    it('should be GB for 3', (): void => {
      expect(fromOrdinal(3)).toEqual(MemoryUnit.GB);
    });

    describe('undefined cases', (): void => {
      [-1, Object.keys(MemoryUnit).length, 1.5, NaN, Infinity].forEach((n: number): void => {
        it(`should be undefined for ${n}`, (): void => {
          expect(fromOrdinal(n)).toBeUndefined();
        });
      });
    });
  });
});
