import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Spaces } from 'ngx-fabric8-wit';
import {
  BehaviorSubject,
  Observable,
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
  environments: Subject<Environment[]> = new BehaviorSubject([]);
  applications: Subject<string[]> = new BehaviorSubject([]);

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
    this.spaceId = this.spaces.current.first().map(space => space.id);

    this.updateResources();
  }

  private updateResources(): void {
    this.subscriptions.push(
      this.spaceId.subscribe(spaceId => {
        this.deploymentsService.getEnvironments(spaceId).subscribe((envs: Environment[]) => {
          console.log('Deployments ' + JSON.stringify(envs));
          this.environments.next(envs);
        });
        this.deploymentsService.getApplications(spaceId).subscribe((apps: string[]) => {
          this.applications.next(apps);
        });
      })
    );
  }

}
