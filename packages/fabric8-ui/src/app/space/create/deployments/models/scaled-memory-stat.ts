import { round } from 'lodash';
import { MemoryStat } from './memory-stat';
import {
  MemoryUnit,
  ordinal
} from './memory-unit';
import { ScaledStat } from './scaled-stat';

export class ScaledMemoryStat implements MemoryStat, ScaledStat {

  private _raw: number;
  private _units: MemoryUnit;

  constructor(
    private _used: number,
    private _quota: number,
    private _timestamp?: number
  ) {
    this._raw = this._used;
    let scale = 0;
    if (this._used !== 0) {
      while (this._used >= 1024 && scale < Object.keys(MemoryUnit).length) {
        this._used /= 1024;
        this._quota /= 1024;
        scale++;
      }
    } else {
      while (this._quota >= 1024 && scale < Object.keys(MemoryUnit).length) {
        this._quota /= 1024;
        scale++;
      }
    }
    this._used = round(this._used, 1);
    this._quota = round(this._quota, 1);
    this._units = MemoryUnit[Object.keys(MemoryUnit)[scale]];
  }

  get raw(): number {
    return this._raw;
  }

  get units(): MemoryUnit {
    return this._units;
  }

  get used(): number {
    return this._used;
  }

  get quota(): number {
    return this._quota;
  }

  get timestamp(): number {
    return this._timestamp;
  }

  static from(stat: MemoryStat, unit: MemoryUnit): ScaledMemoryStat {
    const fromPower: number = ordinal(stat.units);
    const toPower: number = ordinal(unit);
    const scaleFactor: number = Math.pow(1024, fromPower - toPower);

    const res: ScaledMemoryStat = new ScaledMemoryStat(stat.used, stat.quota, stat.timestamp);
    res._used = round(stat.used * scaleFactor, 1);
    res._quota = round(stat.quota * scaleFactor, 1);
    res._units = unit;
    return res;
  }
}
