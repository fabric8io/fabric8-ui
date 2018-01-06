import { Component, ViewChild } from '@angular/core';
import { Deployment } from '../../../model/deployment.model';
import { DeploymentService } from '../../../service/deployment.service';
import { Observable } from 'rxjs';
import { DeploymentConfigService } from '../../../service/deploymentconfig.service';
import { CompositeDeploymentStore } from '../../../store/compositedeployment.store';
import { DeploymentConfig } from '../../../model/deploymentconfig.model';

@Component({
  selector: 'scale-deployment-dialog',
  templateUrl: './scale-dialog.deployment.component.html'
})
export class DeploymentScaleDialog {
  deployment: Deployment = new Deployment();
  modal: any;
  replicas: number = 0;

  @ViewChild('scaleInput') scaleInput;


  constructor(private deploymentService: DeploymentService,
              private deploymentConfigService: DeploymentConfigService,
              private deploymentStore: CompositeDeploymentStore) {
  }

  configure(modal: any, deployment: Deployment) {
    this.modal = modal;
    this.deployment = deployment;
    this.replicas = deployment.replicas || 0;
  }


  ok() {
    this.modal.close();

    const deployment = this.deployment;
    console.log('scaling deployment ' + deployment.name);
    if (this.replicas !== deployment.replicas) {
      deployment.replicas = this.replicas;
      if (deployment instanceof DeploymentConfig) {
        this.deploymentConfigService.update(deployment).subscribe(
          () => {
            this.deploymentStore.loadAll();
          }
        );
      } else {
        this.deploymentService.update(deployment).subscribe(
          () => {
            this.deploymentStore.loadAll();
          }
        );
      }
    }
  }

  open() {
    this.modal.open();
    Observable.timer(100).subscribe(next => {
      if (this.scaleInput) {
        this.scaleInput.nativeElement.focus();
      } else {
        console.log('Warning: could not find #scaleInput in the template: scale-dialog.deployment.component.html');
      }
    });
  }

  close() {
    this.modal.close();
  }
}
