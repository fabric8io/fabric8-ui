import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import { Observable } from 'rxjs';

import { MemoryStat } from 'app/space/create/deployments/models/memory-stat';
import { Environment } from '../models/environment';
import { DeploymentsService } from '../services/deployments.service';

@Component({
  selector: 'resource-card',
  templateUrl: 'resource-card.component.html'
})
export class ResourceCardComponent implements OnInit {

  @Input() spaceId: string;
  @Input() environment: Environment;

  memUnit: Observable<string>;

  constructor(
    private deploymentsService: DeploymentsService
  ) { }

  ngOnInit(): void {
    if (this.spaceId && this.environment) {
      this.memUnit = this.deploymentsService.getEnvironmentMemoryStat(this.spaceId, this.environment.name)
        .map((stat: MemoryStat) => stat.units);
    }
  }
}
