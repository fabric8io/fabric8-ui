import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { ConnectableObservable, Observable, Subscription } from 'rxjs';
import { map, publishReplay, switchMap, tap } from 'rxjs/operators';
import {
  ApplicationAttributesOverview,
  ApplicationOverviewService,
} from './application-overview.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-environment-widget',
  templateUrl: './environment-widget.component.html',
  styleUrls: ['./environment-widget.component.less'],
  providers: [ApplicationOverviewService],
})
export class EnvironmentWidgetComponent implements OnInit, OnDestroy {
  appInfos: ConnectableObservable<ApplicationAttributesOverview[]>;
  loading: boolean = true;

  private readonly subscriptions: Subscription[] = [];

  constructor(spaces: Spaces, applicationOverviewService: ApplicationOverviewService) {
    this.appInfos = spaces.current.pipe(
      map((space: Space): string => space.id),
      tap(() => (this.loading = true)),
      switchMap(
        (spaceId: string): Observable<ApplicationAttributesOverview[]> =>
          applicationOverviewService.getAppsAndEnvironments(spaceId),
      ),
      tap(() => (this.loading = false)),
      publishReplay(),
    ) as ConnectableObservable<ApplicationAttributesOverview[]>;
    // shouldn't need the type assertion here but the return type of the surrounding pipe is
    // Observable, even though publishReplay gives a ConnectableObservable
  }

  ngOnInit(): void {
    this.subscriptions.push(this.appInfos.connect());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => subscription.unsubscribe());
  }
}
