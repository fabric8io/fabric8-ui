import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Environment } from '../models/environment';
import { MemoryStat } from '../models/memory-stat';
import { Stat } from '../models/stat';
import { DeploymentsService } from '../services/deployments.service';

@Component({
  selector: 'resource-card',
  templateUrl: 'resource-card.component.html'
})
export class ResourceCardComponent implements OnDestroy, OnInit {

  @Input() spaceId: Observable<string>;
  @Input() environment: Environment;

  memUnit: Observable<string>;
  active: boolean = false;

  cpuStat: Observable<Stat>;
  memStat: Observable<Stat>;

  private subscriptions: Subscription[] = [];

  constructor(
    private deploymentsService: DeploymentsService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.spaceId.subscribe((spaceId: string) => {
      this.subscriptions.push(this.deploymentsService
      .isDeployedInEnvironment(spaceId, this.environment.name)
      .subscribe((active: boolean) => {
        this.active = active;
        if (active) {
          this.memUnit = this.deploymentsService.getEnvironmentMemoryStat(spaceId, this.environment.name)
          .first()
          .map((stat: MemoryStat) => stat.units);
        }
      }));
      this.cpuStat = this.deploymentsService.getEnvironmentCpuStat(spaceId, this.environment.name);
      this.memStat = this.deploymentsService.getEnvironmentMemoryStat(spaceId, this.environment.name);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

}
