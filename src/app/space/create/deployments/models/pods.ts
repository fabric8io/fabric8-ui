import { PodPhase } from './pod-phase';

export type PodsData = [PodPhase, number];

export declare interface Pods {
  readonly pods: PodsData[];
  readonly total: number;
}
