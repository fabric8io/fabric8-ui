import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Context, Contexts, Space, Spaces } from 'ngx-fabric8-wit';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
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
export class EnvironmentWidgetComponent implements OnInit, OnDestroy {

  spaceId: Observable<string>;
  appInfos: Observable<ApplicationAttributesOverview[]>;
  contextPath: Observable<string>;

  private readonly subscriptions: Subscription[] = [];

  constructor(private context: Contexts,
              private spaces: Spaces,
              private applicationOverviewService: ApplicationOverviewService) {
    this.spaceId = this.spaces.current.pipe(map((space: Space): string => space.id));
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.spaceId.subscribe((spaceId: string): void => {
        this.appInfos = this.applicationOverviewService.getAppsAndEnvironments(spaceId);
      })
    );

    this.contextPath = this.context.current.pipe(map((context: Context): string => context.path));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

}
