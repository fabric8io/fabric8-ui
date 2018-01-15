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
  active: boolean = false;

  constructor(
    private deploymentsService: DeploymentsService
  ) { }

  ngOnInit(): void {
    this.deploymentsService
    .isDeployedInEnvironment(this.spaceId, this.environment.name)
    .subscribe((active: boolean) => {
      this.active = active;
      if (active) {
        this.memUnit = this.deploymentsService.getEnvironmentMemoryStat(this.spaceId, this.environment.name)
        .first()
        .map((stat: MemoryStat) => stat.units);
      }
    });


  }

}
