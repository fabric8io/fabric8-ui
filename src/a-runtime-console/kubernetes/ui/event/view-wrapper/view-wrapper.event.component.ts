import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Event} from "../../../model/event.model";
import {EventStore} from "../../../store/event.store";
import {AbstractViewWrapperComponent} from "../../../support/abstract-viewwrapper-component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'fabric8-event-view-wrapper',
  templateUrl: './view-wrapper.event.component.html',
})
export class EventViewWrapperComponent extends AbstractViewWrapperComponent implements OnInit {
  event: Observable<Event>;

  constructor(private store: EventStore, route: ActivatedRoute) {
    super(route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.event = this.store.resource;
  }
}
