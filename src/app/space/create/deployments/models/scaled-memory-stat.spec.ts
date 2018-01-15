import { ScaledMemoryStat } from './scaled-memory-stat';

describe('ScaledMemoryStat', () => {

  it('should not scale 500 bytes', () => {
    let stat = new ScaledMemoryStat(500, 1024);
    expect(stat.used).toEqual(500);
    expect(stat.quota).toEqual(1024);
    expect(stat.units).toEqual('bytes');
  });

  it('should scale 2048 bytes', () => {
    let stat = new ScaledMemoryStat(2048, 4096);
    expect(stat.used).toEqual(2);
    expect(stat.quota).toEqual(4);
    expect(stat.units).toEqual('KB');
  });

  it('should scale 5.5GB', () => {
    let gb = Math.pow(1024, 3);
    let stat = new ScaledMemoryStat(5.5 * gb, 5.9 * gb);
    expect(stat.used).toEqual(5.5);
    expect(stat.quota).toEqual(5.9);
    expect(stat.units).toEqual('GB');
  });

  it('should scale quota when used is 0', () => {
    let gb = Math.pow(1024, 3);
    let stat = new ScaledMemoryStat(0, 2 * gb);
    expect(stat.used).toEqual(0);
    expect(stat.quota).toEqual(2);
    expect(stat.units).toEqual('GB');
  });

});
