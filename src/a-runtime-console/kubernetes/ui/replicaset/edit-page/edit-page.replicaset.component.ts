import { Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { ReplicaSetStore } from "../../../store/replicaset.store";

@Component({
  selector: 'fabric8-replicaset-edit-page',
  templateUrl: './edit-page.replicaset.component.html',
})
export class ReplicaSetEditPage implements OnDestroy {
  private idSubscription: Subscription;

  constructor(store: ReplicaSetStore, route: ActivatedRoute) {
    this.idSubscription = route.params.pluck<Params, string>('id')
      .map((id) => store.load(id))
      .subscribe();
  }

  ngOnDestroy() { this.idSubscription.unsubscribe(); }
}
