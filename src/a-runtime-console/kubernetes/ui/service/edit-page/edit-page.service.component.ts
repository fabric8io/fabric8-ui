import {Component, OnDestroy} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {ServiceStore} from "../../../store/service.store";

@Component({
  selector: 'fabric8-service-edit-page',
  templateUrl: './edit-page.service.component.html',
})
export class ServiceEditPage implements OnDestroy {
  private idSubscription: Subscription;

  constructor(store: ServiceStore, route: ActivatedRoute) {
    this.idSubscription = route.params.pluck<Params, string>('id')
      .map((id) => store.load(id))
      .subscribe();
  }

  ngOnDestroy() { this.idSubscription.unsubscribe(); }
}
