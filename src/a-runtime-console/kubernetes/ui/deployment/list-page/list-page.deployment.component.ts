import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Deployments} from "../../../model/deployment.model";
import {Services} from "../../../model/service.model";
import {CompositeDeploymentStore} from "../../../store/compositedeployment.store";
import {DeploymentViews, createDeploymentViews} from "../../../view/deployment.view";
import {RouteServiceStore} from "../../../store/route.service.store";


@Component({
  selector: 'fabric8-deployments-list-page',
  templateUrl: './list-page.deployment.component.html',
})
export class DeploymentsListPage implements OnInit {
  private readonly deployments: Observable<Deployments>;
  private readonly services: Observable<Services>;
  private readonly loading: Observable<boolean>;
  private readonly runtimeDeployments: Observable<DeploymentViews>;

  constructor(private deploymentsStore: CompositeDeploymentStore, private serviceStore: RouteServiceStore) {
    this.deployments = this.deploymentsStore.list;
    this.services = this.serviceStore.list;
    this.loading = this.deploymentsStore.loading.combineLatest(this.serviceStore.loading, (f, s) => f && s);
    this.runtimeDeployments = this.deployments.combineLatest(this.services, createDeploymentViews);
  }

  ngOnInit() {
    this.deploymentsStore.loadAll();
    this.serviceStore.loadAll();
  }

}
