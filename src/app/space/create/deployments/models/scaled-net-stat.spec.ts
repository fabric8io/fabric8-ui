import { ScaledNetStat } from './scaled-net-stat';

describe('ScaledNetStat', () => {

  it('should not scale 500 bytes', () => {
    let stat = new ScaledNetStat(500);
    expect(stat.raw).toEqual(500);
    expect(stat.used).toEqual(500);
    expect(stat.units).toEqual('bytes');
  });

  it('should scale 2048 bytes', () => {
    let stat = new ScaledNetStat(2048);
    expect(stat.raw).toEqual(2048);
    expect(stat.used).toEqual(2);
    expect(stat.units).toEqual('KB');
  });

  it('should scale 5.5GB', () => {
    let gb = Math.pow(1024, 3);
    let stat = new ScaledNetStat(5.5 * gb);
    expect(stat.raw).toEqual(5.5 * gb);
    expect(stat.used).toEqual(5.5);
    expect(stat.units).toEqual('GB');
  });

});
