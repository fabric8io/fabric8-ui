import { Injectable } from '@angular/core';
import { ReplicaSet, ReplicaSets } from '../model/replicaset.model';
import { NamespaceScope } from '../service/namespace.scope';
import { ReplicaSetService } from '../service/replicaset.service';
import { NamespacedResourceStore } from './namespacedresource.store';

@Injectable()
export class ReplicaSetStore extends NamespacedResourceStore<ReplicaSet, ReplicaSets, ReplicaSetService> {
  constructor(replicaSetReplicaSet: ReplicaSetService, namespaceScope: NamespaceScope) {
    super(replicaSetReplicaSet, [], <ReplicaSet> {}, namespaceScope, ReplicaSet);
  }

  protected get kind() {
    return 'ReplicaSet';
  }
}
