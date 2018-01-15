import { Stat } from './stat';

export type MemoryUnit = 'bytes' | 'KB' | 'MB' | 'GB';

export declare interface MemoryStat extends Stat {
  readonly units: MemoryUnit;
}
