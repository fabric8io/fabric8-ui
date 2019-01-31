import { ReplicaSet, ReplicaSets } from '../model/replicaset.model';
import { Service, Services } from '../model/service.model';

export class ReplicaSetView {
  public readonly replicaset: ReplicaSet;

  public readonly service: Service;

  public readonly id: string;

  public readonly name: string;

  public readonly icon: string;

  public readonly description: string;

  public readonly exposeUrl: string;

  public readonly replicas: number;

  public readonly availableReplicas: number;

  public readonly labels: Map<string, string>;

  public readonly images: Array<String>;

  public readonly annotations: Map<string, string>;

  public readonly creationTimestamp: any;

  constructor(replicaset: ReplicaSet, service: Service) {
    this.replicaset = replicaset;
    this.service = service;
    this.id = replicaset.id;
    this.name = replicaset.name;
    this.icon = replicaset.icon;
    this.description = replicaset.description;
    this.labels = replicaset.labels;
    this.annotations = replicaset.annotations;
    this.creationTimestamp = replicaset.creationTimestamp;
    if (service) {
      this.exposeUrl = service.exposeUrl;
    }
    this.images = new Array<String>();
    const spec = replicaset.spec;
    if (spec) {
      const template = spec.template;
      if (template) {
        const podSpec = template.spec;
        if (podSpec) {
          const containers = podSpec.containers;
          if (containers) {
            containers.forEach((c) => {
              const image = c.image;
              if (image) {
                this.images.push(image);
              }
            });
          }
        }
      }
    }
    this.replicas = 0;
    this.availableReplicas = 0;
    const status = replicaset.status;
    if (status) {
      this.replicas = status.replicas || 0;
      this.availableReplicas = status.availableReplicas || 0;
    }
  }
}

export class ReplicaSetViews extends Array<ReplicaSetView> {}

export function createReplicaSetViews(
  replicasets: ReplicaSets,
  services: Services,
): ReplicaSetViews {
  const map = {};
  services.forEach((s) => (map[s.name] = s));
  return replicasets.map((d) => new ReplicaSetView(d, map[d.name]));
}
