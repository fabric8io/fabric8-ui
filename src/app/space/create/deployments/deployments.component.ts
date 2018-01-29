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
  styleUrls: ['./deployments.component.less'],
  providers: [DeploymentsService]
})
export class DeploymentsComponent implements OnDestroy, OnInit {

  spaceId: Subject<string> = new ReplaySubject(1);
  environments: Subject<Environment[]> = new ReplaySubject(1);
  applications: Subject<string[]> = new ReplaySubject(1);

  private subscriptions: Subscription[] = [];

  constructor(
    private spaces: Spaces,
    private deploymentsService: DeploymentsService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.spaces.current.first().map(space => space.id).subscribe(this.spaceId)
    );
    this.updateResources();
  }

  private updateResources(): void {
    this.subscriptions.push(
      this.spaceId.subscribe(spaceId => {
        this.subscriptions.push(
          this.deploymentsService.getEnvironments(spaceId).subscribe(this.environments)
        );

        this.subscriptions.push(
          this.deploymentsService.getApplications(spaceId).subscribe(this.applications)
        );
      })
    );
  }

}
