import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemoryStat } from '../models/memory-stat';
import { MemoryUnit } from '../models/memory-unit';
import { DeploymentStatusService } from '../services/deployment-status.service';
import { DeploymentsService } from '../services/deployments.service';

@Component({
  selector: 'resource-card',
  templateUrl: 'resource-card.component.html',
  styleUrls: ['./resource-card.component.less']
})
export class ResourceCardComponent implements OnInit {

  @Input() spaceId: string;
  @Input() environment: string;

  memUnit: Observable<string>;

  constructor(
    readonly deploymentsService: DeploymentsService,
    readonly deploymentStatusService: DeploymentStatusService
  ) { }

  ngOnInit(): void {
    if (this.spaceId && this.environment) {
      this.memUnit = this.deploymentsService.getEnvironmentMemoryStat(this.spaceId, this.environment).pipe(
        map((stat: MemoryStat): MemoryUnit => stat.units)
      );
    }
  }
}
