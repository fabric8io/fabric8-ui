import { Injectable } from '@angular/core';
import { Event, Events } from '../model/event.model';
import { EventService } from '../service/event.service';
import { NamespaceScope } from '../service/namespace.scope';
import { NamespacedResourceStore } from './namespacedresource.store';

@Injectable()
export class EventStore extends NamespacedResourceStore<Event, Events, EventService> {
  constructor(eventEvent: EventService, namespaceScope: NamespaceScope) {
    super(eventEvent, [], <Event> {}, namespaceScope, Event);
  }

  protected get kind() {
    return 'Event';
  }
}
