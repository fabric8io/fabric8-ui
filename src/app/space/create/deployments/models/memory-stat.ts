import { MemoryUnit } from './memory-unit';
import { Stat } from './stat';

export interface MemoryStat extends Stat {
  readonly units: MemoryUnit;
}
