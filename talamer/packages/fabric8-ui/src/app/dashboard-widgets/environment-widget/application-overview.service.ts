import {
  Injectable,
  OnDestroy
} from '@angular/core';
import { Observable,
  Subject,
  timer as observableTimer
} from 'rxjs';
import { distinctUntilChanged, map, mergeMap, shareReplay, takeUntil } from 'rxjs/operators';
import {
  Application,
  Deployment,
  DeploymentApiService
} from '../../space/create/deployments/services/deployment-api.service';

export interface ApplicationAttributesOverview {
  appName: string;
  deploymentsInfo: DeploymentPreviewInfo[];
}

export interface DeploymentPreviewInfo {
  name: string;
  version: string;
  url: string;
}

@Injectable()
export class ApplicationOverviewService implements OnDestroy {

  private readonly destroyed: Subject<void> = new Subject<void>();

  private readonly pollTimer: Observable<void> = observableTimer(0, 10000).pipe(
    map(() => null),
    takeUntil(this.destroyed));

  constructor(
    private deploymentApiService: DeploymentApiService
  ) { }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  getAppsAndEnvironments(spaceId: string): Observable<ApplicationAttributesOverview[]> {
    return this.pollTimer.pipe(mergeMap(() =>
      this.deploymentApiService.getApplications(spaceId).pipe(
        map((apps: Application[]): Application[] => apps || []),
        map((apps: Application[]): Application[] => apps.sort((a: Application, b: Application): number => a.attributes.name.localeCompare(b.attributes.name))),
        map((apps: Application[]): ApplicationAttributesOverview[] =>
          apps.map((app: Application): ApplicationAttributesOverview => {
            const appName: string = app.attributes.name;
            const deploymentsInfo: DeploymentPreviewInfo[] = app.attributes.deployments.map(
              (dep: Deployment): DeploymentPreviewInfo => ({
                name: dep.attributes.name,
                version: dep.attributes.version,
                url: dep.attributes.pod_total > 0 ? dep.links.application : null
              })
            ).sort((a: DeploymentPreviewInfo, b: DeploymentPreviewInfo): number => a.name.localeCompare(b.name));
            return { appName, deploymentsInfo };
          })
        ))
    ),
      distinctUntilChanged(),
      shareReplay());
  }

}
