import {
  Component,
  Input
} from '@angular/core';

import { Environment } from '../../models/environment';

@Component({
  selector: 'resource-usage',
  templateUrl: 'resource-usage.component.html',
  styleUrls: ['./resource-usage.component.less']
})
export class ResourceUsageComponent {

  @Input() environments: Environment[];

}
