import { Stat } from './stat';

export enum MemoryUnit {
  B = 'bytes',
  KB = 'KB',
  MB = 'MB',
  GB = 'GB'
}

export function ordinal(unit: MemoryUnit): number {
  return Object.keys(MemoryUnit)
    .map((k: string): string => MemoryUnit[k])
    .indexOf(unit);
}

export interface MemoryStat extends Stat {
  readonly units: MemoryUnit;
}
