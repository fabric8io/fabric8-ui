import {
  Component,
  Input
} from '@angular/core';

import { Environment } from '../models/environment';

import { Observable } from 'rxjs';

@Component({
  selector: 'deployments-resource-usage',
  styleUrls: ['./deployments-resource-usage.component.less'],
  templateUrl: 'deployments-resource-usage.component.html'
})
export class DeploymentsResourceUsageComponent {

  @Input() environments: Observable<Environment[]>;
  @Input() spaceId: Observable<string>;

  constructor() { }

}
