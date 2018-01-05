import { Component } from "@angular/core";
import { ReplicaSet } from "../../../model/replicaset.model";
import { ReplicaSetService } from "../../../service/replicaset.service";
import { ReplicationControllerService } from "../../../service/replicationcontroller.service";
import { CompositeReplicaSetStore } from "../../../store/compositedreplicaset.store";
import { ReplicationController } from "../../../model/replicationcontroller.model";

@Component({
  selector: 'scale-replicaset-dialog',
  templateUrl: './scale-dialog.replicaset.component.html'
})
export class ReplicaSetScaleDialog {
  replicaset: ReplicaSet = new ReplicaSet();
  modal: any;
  replicas: number = 0;

  constructor(private replicasetService: ReplicaSetService,
              private replicationControllerService: ReplicationControllerService,
              private replicasetStore: CompositeReplicaSetStore) {
  }

  configure(modal: any, replicaset: ReplicaSet) {
    this.modal = modal;
    this.replicaset = replicaset;
    this.replicas = replicaset.replicas || 0;
  }

  ok() {
    this.modal.close();

    const replicaset = this.replicaset;
    console.log('scaling replicaset ' + replicaset.name);
    if (this.replicas !== replicaset.replicas) {
      replicaset.replicas = this.replicas;
      if (replicaset instanceof ReplicationController) {
        this.replicationControllerService.update(replicaset).subscribe(
          () => {
            this.replicasetStore.loadAll();
          }
        );
      } else {
        this.replicasetService.update(replicaset).subscribe(
          () => {
            this.replicasetStore.loadAll();
          }
        );
      }
    }
  }

  close() {
    this.modal.close();
  }
}
