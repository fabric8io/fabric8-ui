import {
  Component,
  Input,
} from '@angular/core';

import { Environment } from './models/environment';

import { Observable } from 'rxjs';

@Component({
  selector: 'deployment-card-container',
  templateUrl: 'deployment-card-container.component.html'
})
export class DeploymentCardContainerComponent {

  @Input() environments: Observable<Environment[]>;
  @Input() application: string;

  constructor() { }

}
