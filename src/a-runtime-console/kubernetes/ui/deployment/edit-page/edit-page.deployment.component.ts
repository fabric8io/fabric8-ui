import { Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { DeploymentStore } from "../../../store/deployment.store";

@Component({
  selector: 'fabric8-deployment-edit-page',
  templateUrl: './edit-page.deployment.component.html',
})
export class DeploymentEditPage implements OnDestroy {
  private idSubscription: Subscription;

  constructor(store: DeploymentStore, route: ActivatedRoute) {
    this.idSubscription = route.params.pluck<Params, string>('id')
      .map((id) => store.load(id))
      .subscribe();
  }

  ngOnDestroy() { this.idSubscription.unsubscribe(); }
}
