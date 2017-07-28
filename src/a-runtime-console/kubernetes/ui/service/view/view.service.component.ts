import {Input, Component} from "@angular/core";
import {Service} from "../../../model/service.model";

@Component({
  selector: 'fabric8-service-view',
  templateUrl: './view.service.component.html',
  styleUrls: ['./view.service.component.scss'],
})
export class ServiceViewComponent {

  @Input() service: Service;
}
