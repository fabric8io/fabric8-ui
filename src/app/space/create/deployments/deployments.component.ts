import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Spaces } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';

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
  environments: Observable<Environment[]>;
  applications: Observable<string[]>;

  constructor(
    private spaces: Spaces,
    private deploymentsService: DeploymentsService
  ) {
    this.spaceId = this.spaces.current.first().map(space => space.id);
   }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.updateResources();
  }

  private updateResources(): void {
    this.spaceId.subscribe(spaceId => {
      this.environments =
        this.deploymentsService.getEnvironments(spaceId);

      this.applications =
        this.deploymentsService.getApplications(spaceId);
    });
  }

}
