import { Component } from "@angular/core";
import { Deployment } from "../../../model/deployment.model";
import { DeploymentService } from "../../../service/deployment.service";
import { DeploymentConfigService } from "../../../service/deploymentconfig.service";
import { CompositeDeploymentStore } from "../../../store/compositedeployment.store";
import { DeploymentConfig } from "../../../model/deploymentconfig.model";

@Component({
  selector: 'delete-deployment-dialog',
  templateUrl: './delete-dialog.deployment.component.html'
})
export class DeploymentDeleteDialog {
  deployment: Deployment = new Deployment();
  modal: any;

  constructor(private deploymentService: DeploymentService,
              private deploymentConfigService: DeploymentConfigService,
              private deploymentStore: CompositeDeploymentStore) {
  }

  ok() {
    console.log('deleting deployment ' + this.deployment.name);
    this.modal.close();
    if (this.deployment instanceof DeploymentConfig) {
      this.deploymentConfigService.delete(this.deployment).subscribe(
        () => {
          this.deploymentStore.loadAll();
        }
      );
    } else {
      this.deploymentService.delete(this.deployment).subscribe(
        () => {
          this.deploymentStore.loadAll();
        }
      );
    }
  }

  close() {
    this.modal.close();
  }
}
