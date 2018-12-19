import { MemoryStat } from './memory-stat';
import { MemoryUnit } from './memory-unit';
import { ScaledMemoryStat } from './scaled-memory-stat';

describe('ScaledMemoryStat', (): void => {
  it('should not scale 500 bytes', (): void => {
    const stat: ScaledMemoryStat = new ScaledMemoryStat(500, 1024);
    expect(stat.used).toEqual(500);
    expect(stat.quota).toEqual(1024);
    expect(stat.units).toEqual(MemoryUnit.B);
  });

  it('should scale 2048 bytes', (): void => {
    const stat: ScaledMemoryStat = new ScaledMemoryStat(2048, 4096);
    expect(stat.used).toEqual(2);
    expect(stat.quota).toEqual(4);
    expect(stat.units).toEqual(MemoryUnit.KB);
  });

  it('should scale 5.5GB', (): void => {
    const gb: number = Math.pow(1024, 3);
    const stat: ScaledMemoryStat = new ScaledMemoryStat(5.5 * gb, 5.9 * gb);
    expect(stat.used).toEqual(5.5);
    expect(stat.quota).toEqual(5.9);
    expect(stat.units).toEqual(MemoryUnit.GB);
  });

  it('should scale quota when used is 0', (): void => {
    const gb: number = Math.pow(1024, 3);
    const stat: ScaledMemoryStat = new ScaledMemoryStat(0, 2 * gb);
    expect(stat.used).toEqual(0);
    expect(stat.quota).toEqual(2);
    expect(stat.units).toEqual(MemoryUnit.GB);
  });

  describe('"from" scaling', (): void => {
    it('should not scale if target unit is the same as original unit', (): void => {
      const original: MemoryStat = {
        used: 100,
        quota: 200,
        units: MemoryUnit.MB,
      };
      const converted: ScaledMemoryStat = ScaledMemoryStat.from(original, MemoryUnit.MB);
      expect(converted).toEqual(
        jasmine.objectContaining({
          raw: 100,
          used: 100,
          quota: 200,
          units: MemoryUnit.MB,
        }),
      );
    });

    it('should scale units down if target unit is larger than original', (): void => {
      const original: MemoryStat = {
        used: 100,
        quota: 200,
        units: MemoryUnit.MB,
      };
      const converted: ScaledMemoryStat = ScaledMemoryStat.from(original, MemoryUnit.GB);
      expect(converted).toEqual(
        jasmine.objectContaining({
          raw: 100,
          used: 0.1,
          quota: 0.2,
          units: MemoryUnit.GB,
        }),
      );
    });

    it('should scale units down if target unit is much larger than original', (): void => {
      const original: MemoryStat = {
        used: 100,
        quota: 200,
        units: MemoryUnit.B,
      };
      const converted: ScaledMemoryStat = ScaledMemoryStat.from(original, MemoryUnit.GB);
      expect(converted).toEqual(
        jasmine.objectContaining({
          raw: 100,
          used: 0,
          quota: 0,
          units: MemoryUnit.GB,
        }),
      );
    });

    it('should scale units up if target unit is smaller than original', (): void => {
      const original: MemoryStat = {
        used: 1,
        quota: 2,
        units: MemoryUnit.KB,
      };
      const converted: ScaledMemoryStat = ScaledMemoryStat.from(original, MemoryUnit.B);
      expect(converted).toEqual(
        jasmine.objectContaining({
          raw: 1,
          used: 1024,
          quota: 2048,
          units: MemoryUnit.B,
        }),
      );
    });

    it('should scale units up if target unit is much smaller than original', (): void => {
      const original: MemoryStat = {
        used: 1,
        quota: 2,
        units: MemoryUnit.GB,
      };
      const converted: ScaledMemoryStat = ScaledMemoryStat.from(original, MemoryUnit.KB);
      expect(converted).toEqual(
        jasmine.objectContaining({
          raw: 1,
          used: 1 * Math.pow(1024, 2),
          quota: 2 * Math.pow(1024, 2),
          units: MemoryUnit.KB,
        }),
      );
    });
  });
});
