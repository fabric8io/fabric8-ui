import { Component, Input } from '@angular/core';
import { Service } from '../../../model/service.model';

@Component({
  selector: 'fabric8-service-view',
  templateUrl: './view.service.component.html'
})
export class ServiceViewComponent {

  @Input() service: Service;
}
