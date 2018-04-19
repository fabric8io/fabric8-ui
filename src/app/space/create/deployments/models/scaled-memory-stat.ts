import {
  MemoryStat,
  MemoryUnit,
  ordinal
} from './memory-stat';
import { ScaledStat } from './scaled-stat';

import { round } from 'lodash';

export class ScaledMemoryStat implements MemoryStat, ScaledStat {

  public readonly raw: number;
  public readonly units: MemoryUnit;

  constructor(
    public readonly used: number,
    public readonly quota: number,
    public readonly timestamp?: number
  ) {
    this.raw = used;
    let scale = 0;
    if (this.used !== 0) {
      while (this.used > 1024 && scale < Object.keys(MemoryUnit).length) {
        this.used /= 1024;
        this.quota /= 1024;
        scale++;
      }
    } else {
      while (this.quota > 1024 && scale < Object.keys(MemoryUnit).length) {
        this.quota /= 1024;
        scale++;
      }
    }
    this.used = round(this.used, 1);
    this.quota = round(this.quota, 1);
    this.units = MemoryUnit[Object.keys(MemoryUnit)[scale]];
  }

  static from(stat: MemoryStat, unit: MemoryUnit): ScaledMemoryStat {
    const fromPower: number = ordinal(stat.units);
    const toPower: number = ordinal(unit);
    const scaleFactor: number = Math.pow(1024, fromPower - toPower);

    return {
      raw: stat.used,
      used: round(stat.used * scaleFactor, 1),
      quota: round(stat.quota * scaleFactor, 1),
      timestamp: stat.timestamp,
      units: unit
    };
  }
}
