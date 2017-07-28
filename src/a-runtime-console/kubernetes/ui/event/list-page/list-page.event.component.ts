import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Events} from "../../../model/event.model";
import {EventStore} from "../../../store/event.store";
import {ServiceStore} from "../../../store/service.store";


@Component({
  selector: 'fabric8-events-list-page',
  templateUrl: './list-page.event.component.html',
  styleUrls: ['./list-page.event.component.scss'],
})
export class EventsListPage implements OnInit {
  private readonly events: Observable<Events>;
  private readonly loading: Observable<boolean>;

  constructor(private eventsStore: EventStore, private serviceStore: ServiceStore) {
    this.events = this.eventsStore.list;
    this.loading = this.eventsStore.loading;
  }

  ngOnInit() {
    this.eventsStore.loadAll();
    this.serviceStore.loadAll();
  }

}
