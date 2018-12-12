export interface ScaledStat {
  readonly raw: number;
}

export function instanceOfScaledStat(object: any): object is ScaledStat {
  return 'raw' in object;
}
