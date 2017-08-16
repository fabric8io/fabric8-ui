import {Component, OnDestroy} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {SpaceStore} from "../../../store/space.store";

@Component({
  selector: 'fabric8-space-edit-page',
  templateUrl: './edit-page.space.component.html',
})
export class SpaceEditPage implements OnDestroy {
  private idSubscription: Subscription;

  constructor(store: SpaceStore, route: ActivatedRoute) {
    this.idSubscription = route.params.pluck<Params, string>('id')
      .map((id) => store.load(id))
      .subscribe();
  }

  ngOnDestroy() { this.idSubscription.unsubscribe(); }
}
