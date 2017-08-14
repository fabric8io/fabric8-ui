import {Component, Input} from "@angular/core";
import {StatusInfo} from "./status-list.component";

@Component({
  selector: 'status-info',
  templateUrl: './status-info.component.html',
})
export class StatusInfoComponent {

  @Input() info: StatusInfo;

}
