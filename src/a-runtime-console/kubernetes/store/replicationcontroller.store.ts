import {Injectable} from '@angular/core';
import {ReplicationControllerService} from '../service/replicationcontroller.service';
import {ReplicationController, ReplicationControllers} from '../model/replicationcontroller.model';
import {NamespacedResourceStore} from './namespacedresource.store';
import {NamespaceScope} from '../service/namespace.scope';

@Injectable()
export class ReplicationControllerStore extends NamespacedResourceStore<ReplicationController, ReplicationControllers, ReplicationControllerService> {
  constructor(replicationControllerReplicationController: ReplicationControllerService, namespaceScope: NamespaceScope) {
    super(replicationControllerReplicationController, [], <ReplicationController>{}, namespaceScope, ReplicationController);
  }

  protected get kind() {
    return 'ReplicationController';
  }
}
