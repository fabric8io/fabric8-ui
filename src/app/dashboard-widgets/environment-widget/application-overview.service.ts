import {
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  Observable,
  Subject
} from 'rxjs';

import {
  Application,
  Deployment,
  DeploymentApiService
} from '../../../app/space/create/deployments/services/deployment-api.service';

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

  private readonly pollTimer: Observable<void> = Observable.timer(0, 10000)
    .map(() => null)
    .takeUntil(this.destroyed);

  constructor(
    private deploymentApiService: DeploymentApiService
  ) { }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  getAppsAndEnvironments(spaceId: string): Observable<ApplicationAttributesOverview[]> {
    return this.pollTimer.mergeMap(() =>
      this.deploymentApiService.getApplications(spaceId)
        .map((apps: Application[]): Application[] => apps || [])
        .map((apps: Application[]): Application[] => apps.sort((a: Application, b: Application): number => a.attributes.name.localeCompare(b.attributes.name)))
        .map((apps: Application[]): ApplicationAttributesOverview[] =>
          apps.map((app: Application): ApplicationAttributesOverview => {
            const appName: string = app.attributes.name;
            const deploymentsInfo: DeploymentPreviewInfo[] = app.attributes.deployments.map(
              (dep: Deployment): DeploymentPreviewInfo => ({
                name: dep.attributes.name, version: dep.attributes.version, url: dep.links.application
              })
            ).sort((a: DeploymentPreviewInfo, b: DeploymentPreviewInfo): number => a.name.localeCompare(b.name));
            return { appName, deploymentsInfo };
          })
        )
    )
      .distinctUntilChanged()
      .shareReplay();
  }

}
