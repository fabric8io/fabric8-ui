export enum MemoryUnit {
  B = 'bytes',
  KB = 'KB',
  MB = 'MB',
  GB = 'GB',
}

export function ordinal(unit: MemoryUnit): number {
  return Object.keys(MemoryUnit)
    .map((k: string): string => MemoryUnit[k])
    .indexOf(unit);
}

export function fromOrdinal(ordinal: number): MemoryUnit {
  return MemoryUnit[Object.keys(MemoryUnit)[ordinal]];
}
