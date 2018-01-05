import { Component, Input, ViewChild } from "@angular/core";
import { TREE_ACTIONS } from "angular2-tree-component";
import { ParentLinkFactory } from "../../../../common/parent-link-factory";
import { AppDeployments } from "../list-page/list-page.app.component";
import { Space, createEmptySpace } from "../../../model/space.model";
import { DeploymentDeleteDialog } from "../../deployment/delete-dialog/delete-dialog.deployment.component";
import { DeploymentScaleDialog } from "../../deployment/scale-dialog/scale-dialog.deployment.component";

@Component({
  selector: 'fabric8-apps-list',
  templateUrl: './list.app.component.html',
  styleUrls: ['./list.app.component.less'],
})
export class AppListComponent {
  parentLink: string;

  @Input() loading: boolean;
  @Input() apps: AppDeployments[];
  @Input() space: Space;


  @ViewChild(DeploymentDeleteDialog) deleteDialog: DeploymentDeleteDialog;
  @ViewChild(DeploymentScaleDialog) scaleDialog: DeploymentScaleDialog;

  constructor(
    parentLinkFactory: ParentLinkFactory,
  ) {
    this.parentLink = parentLinkFactory.parentLink;
  }

  openDeleteDialog(deleteDeploymentModal, deployment) {
    this.deleteDialog.modal = deleteDeploymentModal;
    this.deleteDialog.deployment = deployment;
    deleteDeploymentModal.open();
  }

  openScaleDialog(scaleDeploymentModal, deployment) {
    this.scaleDialog.configure(scaleDeploymentModal, deployment);
    this.scaleDialog.open();
  }


}
