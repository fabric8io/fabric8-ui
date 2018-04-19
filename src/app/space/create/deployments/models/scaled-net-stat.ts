import { MemoryUnit } from './memory-stat';
import { NetStat } from './network-stat';
import { ScaledStat } from './scaled-stat';

import { round } from 'lodash';

export class ScaledNetStat implements NetStat, ScaledStat {

  public readonly raw: number;
  public readonly units: MemoryUnit;

  constructor(
    public readonly used: number,
    public readonly timestamp?: number
  ) {
    this.raw = used;
    let scale = 0;
    while (this.used > 1024 && scale < Object.keys(MemoryUnit).length) {
      this.used /= 1024;
      scale++;
    }
    this.used = round(this.used, 1);
    this.units = MemoryUnit[Object.keys(MemoryUnit)[scale]];
  }
}
