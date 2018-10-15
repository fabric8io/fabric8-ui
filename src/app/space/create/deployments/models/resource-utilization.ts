import { CpuStat } from './cpu-stat';
import { MemoryStat } from './memory-stat';
import { Stat } from './stat';

export interface ResourceUtilization {
  currentSpaceUsage: Stat;
  otherSpacesUsage: Stat;
}

export interface CpuResourceUtilization extends ResourceUtilization {
  currentSpaceUsage: CpuStat;
  otherSpacesUsage: CpuStat;
}

export interface MemoryResourceUtilization extends ResourceUtilization {
  currentSpaceUsage: MemoryStat;
  otherSpacesUsage: MemoryStat;
}
