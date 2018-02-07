import { Component } from '@angular/core';
import { ReplicaSet } from '../../../model/replicaset.model';
import { ReplicationController } from '../../../model/replicationcontroller.model';
import { ReplicaSetService } from '../../../service/replicaset.service';
import { ReplicationControllerService } from '../../../service/replicationcontroller.service';
import { CompositeReplicaSetStore } from '../../../store/compositedreplicaset.store';

@Component({
  selector: 'delete-replicaset-dialog',
  templateUrl: './delete-dialog.replicaset.component.html'
})
export class ReplicaSetDeleteDialog {
  replicaset: ReplicaSet = new ReplicaSet();
  modal: any;

  constructor(private replicasetService: ReplicaSetService,
              private replicationControllerService: ReplicationControllerService,
              private replicasetStore: CompositeReplicaSetStore) {
  }

  ok() {
    const replicaset = this.replicaset;
    console.log('deleting replicaset ' + replicaset.name);
    this.modal.close();
    if (replicaset instanceof ReplicationController) {
      this.replicationControllerService.delete(replicaset).subscribe(
        () => {
          this.replicasetStore.loadAll();
        }
      );
    } else {
      this.replicasetService.delete(replicaset).subscribe(
        () => {
          this.replicasetStore.loadAll();
        }
      );
    }
  }

  close() {
    this.modal.close();
  }
}
