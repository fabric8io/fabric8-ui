import {
  MemoryStat,
  MemoryUnit
} from './memory-stat';

import { round } from 'lodash';

export class ScaledMemoryStat implements MemoryStat {

  private static readonly UNITS = ['bytes', 'KB', 'MB', 'GB'];

  public readonly units: MemoryUnit;

  constructor(
    public readonly used: number,
    public readonly quota: number
  ) {
    let scale = 0;
    if (this.used !== 0) {
      while (this.used > 1024 && scale < ScaledMemoryStat.UNITS.length) {
        this.used /= 1024;
        this.quota /= 1024;
        scale++;
      }
    } else {
      while (this.quota > 1024 && scale < ScaledMemoryStat.UNITS.length) {
        this.quota /= 1024;
        scale++;
      }
    }
    this.used = round(this.used, 1);
    this.quota = round(this.quota, 1);
    this.units = ScaledMemoryStat.UNITS[scale] as MemoryUnit;
  }
}
