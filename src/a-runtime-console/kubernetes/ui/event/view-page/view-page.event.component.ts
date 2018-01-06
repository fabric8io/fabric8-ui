import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { EventStore } from '../../../store/event.store';

@Component({
  selector: 'fabric8-event-view-page',
  templateUrl: './view-page.event.component.html'
})
export class EventViewPage implements OnDestroy {
  private idSubscription: Subscription;

  constructor(store: EventStore, route: ActivatedRoute) {
    this.idSubscription = route.params.pluck<Params, string>('id')
      .map((id) => store.load(id))
      .subscribe();
  }

  ngOnDestroy() { this.idSubscription.unsubscribe(); }
}
