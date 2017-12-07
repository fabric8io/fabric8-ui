import {
  Component,
  Input,
} from '@angular/core';

import { Environment } from '../models/environment';

import { Observable } from 'rxjs';

@Component({
  selector: 'deployments-apps',
  templateUrl: 'deployments-apps.component.html'
})
export class DeploymentsAppsComponent {

  @Input() environments: Observable<Environment[]>;
  @Input() applications: Observable<string[]>;

  constructor() { }

}
