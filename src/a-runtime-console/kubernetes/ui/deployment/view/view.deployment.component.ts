import { Input, Component, ViewChild } from '@angular/core';
import { Deployment } from '../../../model/deployment.model';
import { DeploymentScaleDialog } from '../scale-dialog/scale-dialog.deployment.component';

@Component({
  selector: 'fabric8-deployment-view',
  templateUrl: './view.deployment.component.html'
})
export class DeploymentViewComponent {

  @Input() deployment: Deployment;

  @ViewChild(DeploymentScaleDialog) scaleDialog: DeploymentScaleDialog;

  openScaleDialog(scaleDeploymentModal, deployment) {
    this.scaleDialog.configure(scaleDeploymentModal, deployment);
    this.scaleDialog.open();
  }
}
