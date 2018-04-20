import {
  MemoryUnit,
  ordinal
} from './memory-unit';
import { NetStat } from './network-stat';
import { ScaledStat } from './scaled-stat';

import { round } from 'lodash';

export class ScaledNetStat implements NetStat, ScaledStat {

  private _raw: number;
  private _units: MemoryUnit;

  constructor(
    private _used: number,
    private _timestamp?: number
  ) {
    this._raw = _used;
    let scale = 0;
    while (this._used >= 1024 && scale < Object.keys(MemoryUnit).length) {
      this._used /= 1024;
      scale++;
    }
    this._used = round(this._used, 1);
    this._units = MemoryUnit[Object.keys(MemoryUnit)[scale]];
  }

  get raw(): number {
    return this._raw;
  }

  get used(): number {
    return this._used;
  }

  get units(): MemoryUnit {
    return this._units;
  }

  get timestamp(): number {
    return this._timestamp;
  }

  static from(stat: NetStat, unit: MemoryUnit): ScaledNetStat {
    const fromPower: number = ordinal(stat.units);
    const toPower: number = ordinal(unit);
    const scaleFactor: number = Math.pow(1024, fromPower - toPower);

    const res: ScaledNetStat = new ScaledNetStat(stat.used, stat.timestamp);
    res._used = round(stat.used * scaleFactor, 1);
    res._units = unit;
    return res;
  }

}
