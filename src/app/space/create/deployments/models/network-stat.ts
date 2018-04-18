export interface NetworkStat {
  readonly sent: NetStat;
  readonly received: NetStat;
}

export interface NetStat {
  readonly used: number;
  readonly timestamp?: number;
}
