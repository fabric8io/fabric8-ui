import { Component, Input } from "@angular/core";
import { Events } from "../../../model/event.model";

@Component({
  selector: 'fabric8-events-list',
  templateUrl: './list.event.component.html',
  styleUrls: ['./list.event.component.less'],
})
export class EventsListComponent {

  @Input() events: Events;

  @Input() loading: boolean;

  @Input() prefix: string;

  @Input() hideCheckbox: boolean;

  prefixPath(pathComponent: string) {
    return (this.prefix ? this.prefix + '/' : '') + pathComponent;
  }
}
