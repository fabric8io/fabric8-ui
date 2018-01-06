import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { NamespaceStore } from '../../../store/namespace.store';

@Component({
  selector: 'fabric8-namespace-edit-page',
  templateUrl: './edit-page.namespace.component.html'
})
export class NamespaceEditPage implements OnDestroy {
  private idSubscription: Subscription;

  constructor(store: NamespaceStore, route: ActivatedRoute) {
    this.idSubscription = route.params.pluck<Params, string>('id')
      .map((id) => store.load(id))
      .subscribe();
  }

  ngOnDestroy() { this.idSubscription.unsubscribe(); }
}
