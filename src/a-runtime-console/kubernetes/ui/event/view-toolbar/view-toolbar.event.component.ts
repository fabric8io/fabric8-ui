import { Component, Input } from "@angular/core";
import { Event } from "../../../model/event.model";

@Component({
  selector: 'fabric8-event-view-toolbar',
  templateUrl: './view-toolbar.event.component.html',
  styleUrls: ['./view-toolbar.event.component.less']
})
export class EventViewToolbarComponent {

  @Input() event: Event;

}
