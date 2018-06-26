import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import {
  Space,
  Spaces
} from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';

import { DeploymentStatusService } from './services/deployment-status.service';
import {
  DeploymentsService,
  POLL_RATE_TOKEN,
  TIMER_TOKEN,
  TIMESERIES_SAMPLES_TOKEN
} from './services/deployments.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-apps',
  templateUrl: 'deployments.component.html',
  styleUrls: ['./deployments.component.less'],
  providers: [
    DeploymentStatusService,
    DeploymentsService,
    {
      provide: TIMER_TOKEN, useValue: Observable
        .timer(DeploymentsService.DEFAULT_INITIAL_UPDATE_DELAY, DeploymentsService.DEFAULT_POLL_RATE_MS)
        .share()
    },
    { provide: TIMESERIES_SAMPLES_TOKEN, useValue: DeploymentsService.DEFAULT_FRONT_LOAD_SAMPLES },
    { provide: POLL_RATE_TOKEN, useValue: DeploymentsService.DEFAULT_POLL_RATE_MS }
  ]
})
export class DeploymentsComponent {

  spaceId: Observable<string>;
  spaceName: Observable<string>;
  environments: Observable<string[]>;
  applications: Observable<string[]>;

  constructor(
    private readonly spaces: Spaces,
    private readonly deploymentsService: DeploymentsService
  ) {
    this.spaceId = this.spaces.current.first().map((space: Space): string => space.id);
    this.spaceName = this.spaces.current.first().map((space: Space): string => space.attributes.name);
    this.environments = this.spaceId.flatMap((spaceId: string): Observable<string[]> => this.deploymentsService.getEnvironments(spaceId));
    this.applications = this.spaceId.flatMap((spaceId: string): Observable<string[]> => this.deploymentsService.getApplications(spaceId));
  }

}
