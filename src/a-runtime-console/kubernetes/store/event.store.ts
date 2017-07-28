import {Injectable} from '@angular/core';
import {EventService} from '../service/event.service';
import {Event, Events} from '../model/event.model';
import {NamespacedResourceStore} from './namespacedresource.store';
import {NamespaceScope} from '../service/namespace.scope';

@Injectable()
export class EventStore extends NamespacedResourceStore<Event, Events, EventService> {
  constructor(eventEvent: EventService, namespaceScope: NamespaceScope) {
    super(eventEvent, [], <Event>{}, namespaceScope, Event);
  }

  protected get kind() {
    return 'Event';
  }
}
