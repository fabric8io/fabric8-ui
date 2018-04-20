import { MemoryUnit } from './memory-stat';

export interface NetworkStat {
  readonly sent: NetStat;
  readonly received: NetStat;
}

export interface NetStat {
  readonly used: number;
  readonly units: MemoryUnit;
  readonly timestamp?: number;
}
