import {
  Component,
  Input,
} from '@angular/core';

import { Observable } from 'rxjs';

import { Environment } from '../models/environment';

@Component({
  selector: 'deployment-card-container',
  templateUrl: 'deployment-card-container.component.html'
})
export class DeploymentCardContainerComponent {

  @Input() environments: Observable<Environment[]>;
  @Input() application: string;

  constructor() { }

}
