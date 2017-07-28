import {Component, OnDestroy} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {ConfigMapStore} from "../../../store/configmap.store";

@Component({
  selector: 'fabric8-configmap-edit-page',
  templateUrl: './edit-page.configmap.component.html',
  styleUrls: ['./edit-page.configmap.component.scss'],
})
export class ConfigMapEditPage implements OnDestroy {
  private idSubscription: Subscription;

  constructor(store: ConfigMapStore, route: ActivatedRoute) {
    this.idSubscription = route.params.pluck<Params, string>('id')
      .map((id) => store.load(id))
      .subscribe();
  }

  ngOnDestroy() { this.idSubscription.unsubscribe(); }
}
