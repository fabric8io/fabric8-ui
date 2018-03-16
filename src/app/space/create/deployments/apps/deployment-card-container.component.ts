import {
  Component,
  Input
} from '@angular/core';

import { Observable } from 'rxjs';

import { Environment } from '../models/environment';

import { DeleteDeploymentModal } from './delete-deployment-modal.component';

@Component({
  selector: 'deployment-card-container',
  templateUrl: 'deployment-card-container.component.html'
})
export class DeploymentCardContainerComponent {
  @Input() spaceId: string;
  @Input() environments: Observable<Environment[]>;
  @Input() application: string;
}
