import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Spaces } from 'ngx-fabric8-wit';
import {
  Observable,
  ReplaySubject,
  Subject,
  Subscription
} from 'rxjs';

import { Environment } from './models/environment';
import { DeploymentsService } from './services/deployments.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-apps',
  templateUrl: 'deployments.component.html',
  styleUrls: ['./deployments.component.less']
})
export class DeploymentsComponent implements OnDestroy, OnInit {

  spaceId: Observable<string>;
  environments: Subject<Environment[]>;
  applications: Subject<string[]>;

  private subscriptions: Subscription[] = [];

  constructor(
    private spaces: Spaces,
    private deploymentsService: DeploymentsService
  ) {
    this.spaceId = this.spaces.current.first().map(space => space.id);

    this.environments = new ReplaySubject<Environment[]>(1);
    this.applications = new ReplaySubject<string[]>(1);
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
        this.deploymentsService.getEnvironments(spaceId).subscribe(this.environments);
        this.deploymentsService.getApplications(spaceId).subscribe(this.applications);
      })
    );
  }

}
