import { Component, Input, ViewChild } from "@angular/core";
import { DeploymentDeleteDialog } from "../delete-dialog/delete-dialog.deployment.component";
import { DeploymentScaleDialog } from "../scale-dialog/scale-dialog.deployment.component";
import { DeploymentViews } from '../../../view/deployment.view';

@Component({
  selector: 'fabric8-deployments-list',
  templateUrl: './list.deployment.component.html',
  styleUrls: ['./list.deployment.component.scss'],
})
export class DeploymentsListComponent {

  @Input() runtimeDeployments: DeploymentViews;

  @Input() loading: boolean;

  @Input() prefix: string;

  @Input() hideCheckbox: boolean;

  @ViewChild(DeploymentDeleteDialog) deleteDialog: DeploymentDeleteDialog;

  @ViewChild(DeploymentScaleDialog) scaleDialog: DeploymentScaleDialog;

  openDeleteDialog(deleteDeploymentModal, deployment) {
    this.deleteDialog.modal = deleteDeploymentModal;
    this.deleteDialog.deployment = deployment;
    deleteDeploymentModal.open();
  }

  openScaleDialog(scaleDeploymentModal, deployment) {
    this.scaleDialog.configure(scaleDeploymentModal, deployment);
    this.scaleDialog.open();
  }

  prefixPath(pathComponent: string) {
    return (this.prefix ? this.prefix + '/' : '') + pathComponent;
  }

}
