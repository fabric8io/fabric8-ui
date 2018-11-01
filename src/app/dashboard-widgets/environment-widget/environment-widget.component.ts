import { Component, ViewEncapsulation } from '@angular/core';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
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
export class EnvironmentWidgetComponent {

  appInfos: Observable<ApplicationAttributesOverview[]>;

  constructor(
    spaces: Spaces,
    applicationOverviewService: ApplicationOverviewService
  ) {
    this.appInfos = spaces.current
      .pipe(
        map((space: Space): string => space.id),
        mergeMap((spaceId: string): Observable<ApplicationAttributesOverview[]> => applicationOverviewService.getAppsAndEnvironments(spaceId))
      );
  }

}
