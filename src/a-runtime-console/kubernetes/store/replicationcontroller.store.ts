import { Injectable } from '@angular/core';
import { ReplicationController, ReplicationControllers } from '../model/replicationcontroller.model';
import { NamespaceScope } from '../service/namespace.scope';
import { ReplicationControllerService } from '../service/replicationcontroller.service';
import { NamespacedResourceStore } from './namespacedresource.store';

@Injectable()
export class ReplicationControllerStore extends NamespacedResourceStore<ReplicationController, ReplicationControllers, ReplicationControllerService> {
  constructor(replicationControllerReplicationController: ReplicationControllerService, namespaceScope: NamespaceScope) {
    super(replicationControllerReplicationController, [], <ReplicationController> {}, namespaceScope, ReplicationController);
  }

  protected get kind() {
    return 'ReplicationController';
  }
}
