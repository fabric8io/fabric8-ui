import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { combineReplicaSet, combineReplicaSets, ReplicaSet, ReplicaSets } from '../model/replicaset.model';
import { ReplicaSetStore } from './replicaset.store';
import { ReplicationControllerStore } from './replicationcontroller.store';

/**
 * Combines ReplicaSets and ReplicationControllers into a single logical store to simplify the UI logic
 */
@Injectable()
export class CompositeReplicaSetStore {
  public list: Observable<ReplicaSets>;
  public resource: Observable<ReplicaSet>;
  public loading: Observable<boolean>;

  constructor(private replicasetStore: ReplicaSetStore, private replicationcontrollerStore: ReplicationControllerStore) {
    this.list = this.replicasetStore.list.combineLatest(this.replicationcontrollerStore.list, combineReplicaSets);
    this.resource = this.replicasetStore.resource.combineLatest(this.replicationcontrollerStore.resource, combineReplicaSet);
    this.loading = this.replicasetStore.loading.combineLatest(this.replicationcontrollerStore.loading, (f, s) => f && s);
  }

  loadAll(): Observable<ReplicaSets> {
    this.replicasetStore.loadAll();
    this.replicationcontrollerStore.loadAll();
    return this.list;
  }

  load(id: string): void {
    this.replicasetStore.load(id);
    this.replicationcontrollerStore.load(id);
  }
}

