import {Component, OnDestroy} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {ConfigMapStore} from "../../../store/configmap.store";

@Component({
  selector: 'fabric8-configmap-view-page',
  templateUrl: './view-page.configmap.component.html',
})
export class ConfigMapViewPage implements OnDestroy {
  private idSubscription: Subscription;

  constructor(store: ConfigMapStore, route: ActivatedRoute) {
    this.idSubscription = route.params.pluck<Params, string>('id')
      .map((id) => store.load(id))
      .subscribe();
  }

  ngOnDestroy() { this.idSubscription.unsubscribe(); }
}
