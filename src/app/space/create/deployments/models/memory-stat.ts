import { Stat } from './stat';

export declare interface MemoryStat extends Stat {
  readonly units: 'B' | 'KB' | 'MB' | 'GB';
}
