import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, ConnectableObservable, Observable, Subject, Subscription } from 'rxjs/Rx';

import { Context, Contexts, Spaces } from 'ngx-fabric8-wit';

import { Space } from '../../../app/space/create/deployments/services/deployment-api.service';
import {
  ApplicationAttributesOverview,
  ApplicationOverviewService
} from './application-overview.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-environment-widget',
  templateUrl: './environment-widget.component.html',
  styleUrls: ['./environment-widget.component.less'],
  providers: [ApplicationOverviewService]
})
export class EnvironmentWidgetComponent implements OnInit {

  spaceId: Observable<string>;
  appInfos: Observable<ApplicationAttributesOverview[]>;
  contextPath: Observable<string>;

  constructor(private context: Contexts,
              private spaces: Spaces,
              private applicationOverviewService: ApplicationOverviewService) {
    this.spaceId = this.spaces.current.first().map(space => space.id);
  }

  ngOnInit() {
    this.spaceId.subscribe((spaceId: string) => {
      this.appInfos = this.applicationOverviewService.getAppsAndEnvironments(spaceId);
    });

    this.contextPath = this.context.current.map(context => context.path);
  }
}
