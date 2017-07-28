import {Component, Input} from "@angular/core";
import {StatusInfo} from "./status-list.component";

@Component({
  selector: 'status-info',
  templateUrl: './status-info.component.html',
  styleUrls: ['./status-info.component.scss'],
})
export class StatusInfoComponent {

  @Input() info: StatusInfo;

}
