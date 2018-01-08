import { ReplicaSet } from './replicaset.model';

export class ReplicationController extends ReplicaSet {

  defaultKind() {
    return 'ReplicationController';
  }
}

export class ReplicationControllers extends Array<ReplicationController>{
}
