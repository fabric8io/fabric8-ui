import {Component, OnDestroy} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {PodStore} from "../../../store/pod.store";

@Component({
  selector: 'fabric8-pod-view-page',
  templateUrl: './view-page.pod.component.html',
  styleUrls: ['./view-page.pod.component.scss'],
})
export class PodViewPage implements OnDestroy {
  private idSubscription: Subscription;

  constructor(store: PodStore, route: ActivatedRoute) {
    this.idSubscription = route.params.pluck<Params, string>('id')
      .map((id) => store.load(id))
      .subscribe();
  }

  ngOnDestroy() { this.idSubscription.unsubscribe(); }
}
