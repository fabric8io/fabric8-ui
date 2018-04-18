export interface Stat {
  readonly used: number;
  readonly quota: number;
  readonly timestamp?: number;
}
