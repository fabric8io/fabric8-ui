import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Spaces } from 'ngx-fabric8-wit';
import { Observable, Subscription } from 'rxjs';

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
export class DeploymentsComponent implements OnDestroy, OnInit {

  spaceId: Observable<string>;
  spaceName: Observable<string>;
  environments: Observable<string[]>;
  applications: Observable<string[]>;

  private subscriptions: Subscription[] = [];

  constructor(
    private spaces: Spaces,
    private deploymentsService: DeploymentsService
  ) {
    this.spaceId = this.spaces.current.first().map(space => space.id);
    this.spaceName = this.spaces.current.first().map(space => space.attributes.name);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.updateResources();
  }

  private updateResources(): void {
    this.subscriptions.push(
      this.spaceId.subscribe(spaceId => {
        this.environments =
          this.deploymentsService.getEnvironments(spaceId);

        this.applications =
          this.deploymentsService.getApplications(spaceId);
      })
    );
  }

}
