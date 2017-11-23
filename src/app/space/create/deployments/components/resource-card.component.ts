import {
  Component,
  Input
} from '@angular/core';

import { DeploymentsService } from '../services/deployments.service';
@Component({
  selector: 'resource-card',
  templateUrl: 'resource-card.component.html'
})
export class ResourceCardComponent {

  @Input() spaceId: string;
  @Input() environmentId: string;

  constructor(
    private deploymentsService: DeploymentsService
  ) { }

}
