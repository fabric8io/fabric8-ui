import { MemoryUnit } from './memory-unit';
import { NetStat } from './network-stat';
import { ScaledNetStat } from './scaled-net-stat';

describe('ScaledNetStat', (): void => {
  it('should not scale 500 bytes', (): void => {
    const stat: ScaledNetStat = new ScaledNetStat(500);
    expect(stat.raw).toEqual(500);
    expect(stat.used).toEqual(500);
    expect(stat.units).toEqual(MemoryUnit.B);
  });

  it('should scale 2048 bytes', (): void => {
    const stat: ScaledNetStat = new ScaledNetStat(2048);
    expect(stat.raw).toEqual(2048);
    expect(stat.used).toEqual(2);
    expect(stat.units).toEqual(MemoryUnit.KB);
  });

  it('should scale 5.5GB', (): void => {
    const gb = Math.pow(1024, 3);
    const stat: ScaledNetStat = new ScaledNetStat(5.5 * gb);
    expect(stat.raw).toEqual(5.5 * gb);
    expect(stat.used).toEqual(5.5);
    expect(stat.units).toEqual(MemoryUnit.GB);
  });

  describe('"from" scaling', (): void => {
    it('should not scale if target unit is the same as original unit', (): void => {
      const original: NetStat = {
        used: 100,
        units: MemoryUnit.MB,
      };
      const converted: ScaledNetStat = ScaledNetStat.from(original, MemoryUnit.MB);
      expect(converted).toEqual(
        jasmine.objectContaining({
          raw: 100,
          used: 100,
          units: MemoryUnit.MB,
        }),
      );
    });

    it('should scale units down if target unit is larger than original', (): void => {
      const original: NetStat = {
        used: 100,
        units: MemoryUnit.MB,
      };
      const converted: ScaledNetStat = ScaledNetStat.from(original, MemoryUnit.GB);
      expect(converted).toEqual(
        jasmine.objectContaining({
          raw: 100,
          used: 0.1,
          units: MemoryUnit.GB,
        }),
      );
    });

    it('should scale units down if target unit is much larger than original', (): void => {
      const original: NetStat = {
        used: 100,
        units: MemoryUnit.B,
      };
      const converted: ScaledNetStat = ScaledNetStat.from(original, MemoryUnit.GB);
      expect(converted).toEqual(
        jasmine.objectContaining({
          raw: 100,
          used: 0,
          units: MemoryUnit.GB,
        }),
      );
    });

    it('should scale units up if target unit is smaller than original', (): void => {
      const original: NetStat = {
        used: 1,
        units: MemoryUnit.KB,
      };
      const converted: ScaledNetStat = ScaledNetStat.from(original, MemoryUnit.B);
      expect(converted).toEqual(
        jasmine.objectContaining({
          raw: 1,
          used: 1024,
          units: MemoryUnit.B,
        }),
      );
    });

    it('should scale units up if target unit is much smaller than original', (): void => {
      const original: NetStat = {
        used: 1,
        units: MemoryUnit.GB,
      };
      const converted: ScaledNetStat = ScaledNetStat.from(original, MemoryUnit.KB);
      expect(converted).toEqual(
        jasmine.objectContaining({
          raw: 1,
          used: 1 * Math.pow(1024, 2),
          units: MemoryUnit.KB,
        }),
      );
    });
  });
});
