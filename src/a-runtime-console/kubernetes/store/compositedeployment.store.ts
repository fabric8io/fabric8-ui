import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Deployment, Deployments } from '../model/deployment.model';
import { combineDeployment, combineDeployments } from '../view/deployment.view';
import { APIsStore } from './apis.store';
import { DeploymentStore } from './deployment.store';
import { DeploymentConfigStore } from './deploymentconfig.store';

/**
 * Combines Deployments and DeploymentConfigs into a single logical store to simplify the UI logic
 */
@Injectable()
export class CompositeDeploymentStore {
  public list: Observable<Deployments>;
  public resource: Observable<Deployment>;
  public loading: Observable<boolean>;

  constructor(private deploymentsStore: DeploymentStore, private deploymentConfigsStore: DeploymentConfigStore, private apiStore: APIsStore) {
    this.list = this.deploymentsStore.list.combineLatest(this.deploymentConfigsStore.list, combineDeployments);
    this.resource = this.deploymentsStore.resource.combineLatest(this.deploymentConfigsStore.resource, combineDeployment);
    this.loading = this.deploymentsStore.loading.combineLatest(this.deploymentConfigsStore.loading, (f, s) => f && s);
  }

  loadAll(): Observable<Deployments> {
    this.deploymentsStore.loadAll();
    this.apiStore.load();
    // lets wait until we've loaded the APIS before trying to load the DeploymentConfigs
    this.apiStore.loading.distinctUntilChanged().subscribe((flag) => {
      if (!flag) {
        var openshift = this.apiStore.isOpenShift();
        if (openshift) {
          this.deploymentConfigsStore.loadAll();
        }
      }
    });
    return this.list;
  }

  load(id: string): void {
    this.deploymentsStore.load(id);
    this.apiStore.load();
    // lets wait until we've loaded the APIS before trying to load the DeploymentConfigs
    this.apiStore.loading.distinctUntilChanged().subscribe((flag) => {
      if (!flag) {
        var openshift = this.apiStore.isOpenShift();
        if (openshift) {
          this.deploymentConfigsStore.load(id);
        }
      }
    });
  }
}

