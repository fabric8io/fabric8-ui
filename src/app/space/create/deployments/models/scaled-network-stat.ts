import { MemoryUnit } from './memory-stat';

import { round } from 'lodash';

export class ScaledNetworkStat {

  private static readonly UNITS = ['bytes', 'KB', 'MB', 'GB'];

  public readonly raw: number;
  public readonly units: MemoryUnit;

  constructor(
    public readonly used: number
  ) {
    this.raw = used;
    let scale = 0;
    while (this.used > 1024 && scale < ScaledNetworkStat.UNITS.length) {
      this.used /= 1024;
      scale++;
    }
    this.used = round(this.used, 1);
    this.units = ScaledNetworkStat.UNITS[scale] as MemoryUnit;
  }
}
