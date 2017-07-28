import {Component, OnDestroy} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {CompositeReplicaSetStore} from "../../../store/compositedreplicaset.store";

@Component({
  selector: 'fabric8-replicaset-view-page',
  templateUrl: './view-page.replicaset.component.html',
  styleUrls: ['./view-page.replicaset.component.scss'],
})
export class ReplicaSetViewPage implements OnDestroy {
  private idSubscription: Subscription;

  constructor(store: CompositeReplicaSetStore, route: ActivatedRoute) {
    this.idSubscription = route.params.pluck<Params, string>('id')
      .map((id) => store.load(id))
      .subscribe();
  }

  ngOnDestroy() { this.idSubscription.unsubscribe(); }
}
