import { Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { BuildConfigStore } from "../../../store/buildconfig.store";

@Component({
  selector: 'fabric8-buildconfig-edit-page',
  templateUrl: './edit-page.buildconfig.component.html',
})
export class BuildConfigEditPage implements OnDestroy {
  private idSubscription: Subscription;

  constructor(store: BuildConfigStore, route: ActivatedRoute) {
    this.idSubscription = route.params.pluck<Params, string>('id')
      .map((id) => store.load(id))
      .subscribe();
  }

  ngOnDestroy() { this.idSubscription.unsubscribe(); }
}
