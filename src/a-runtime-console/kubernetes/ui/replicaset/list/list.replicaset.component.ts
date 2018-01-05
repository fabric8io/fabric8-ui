import { Component, Input, ViewChild } from "@angular/core";
import { ReplicaSetDeleteDialog } from "../delete-dialog/delete-dialog.replicaset.component";
import { ReplicaSetViews } from "../../../view/replicaset.view";
import { ReplicaSetScaleDialog } from "../scale-dialog/scale-dialog.replicaset.component";

@Component({
  selector: 'fabric8-replicasets-list',
  templateUrl: './list.replicaset.component.html',
  styleUrls: ['./list.replicaset.component.less']
})
export class ReplicaSetsListComponent {

  @Input() runtimeReplicaSets: ReplicaSetViews;

  @Input() loading: boolean;

  @Input() prefix: string;

  @Input() hideCheckbox: boolean;

  @ViewChild(ReplicaSetDeleteDialog) deleteDialog: ReplicaSetDeleteDialog;

  @ViewChild(ReplicaSetScaleDialog) scaleDialog: ReplicaSetScaleDialog;

  openDeleteDialog(deleteReplicaSetModal, replicaset) {
    this.deleteDialog.modal = deleteReplicaSetModal;
    this.deleteDialog.replicaset = replicaset;
    deleteReplicaSetModal.open();
  }

  openScaleDialog(scaleReplicaSetModal, replicaset) {
    this.scaleDialog.configure(scaleReplicaSetModal, replicaset);
    scaleReplicaSetModal.open();
  }

  prefixPath(pathComponent: string) {
    return (this.prefix ? this.prefix + '/' : '') + pathComponent;
  }

}
