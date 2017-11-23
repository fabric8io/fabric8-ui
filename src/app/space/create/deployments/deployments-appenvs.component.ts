import {
  Component,
  Input,
} from '@angular/core';

import { Environment } from './models/environment';

import { Observable } from 'rxjs';

@Component({
  selector: 'deployments-appenvs',
  templateUrl: 'deployments-appenvs.component.html'
})
export class DeploymentsAppEnvsComponent {

  @Input() environments: Observable<Environment[]>;
  @Input() applications: Observable<string[]>;

  constructor() { }

}
