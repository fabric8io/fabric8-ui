import { Stat } from './stat';

export type MemoryUnit = 'bytes' | 'KB' | 'MB' | 'GB';

export interface MemoryStat extends Stat {
  readonly units: MemoryUnit;
}
