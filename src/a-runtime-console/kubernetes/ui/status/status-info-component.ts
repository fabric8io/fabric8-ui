import {Component, Input} from "@angular/core";
import {StatusInfo} from "./status-list.component";

@Component({
  selector: 'status-info',
  templateUrl: './status-info.component.html',
  styles: ['.status-icon-pending { font-size: 1.143em; }']
})
export class StatusInfoComponent {

  @Input() info: StatusInfo;

}
