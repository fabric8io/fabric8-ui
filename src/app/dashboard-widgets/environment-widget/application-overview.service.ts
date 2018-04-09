import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

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
export class ApplicationOverviewService {

  constructor(
    private deploymentApiService: DeploymentApiService
  ) { }

  getAppsAndEnvironments(spaceId: string): Observable<ApplicationAttributesOverview[]> {
    return this.deploymentApiService.getApplications(spaceId)
      .map((apps: Application[]): Application[] => apps || [])
      .map((apps: Application[]): ApplicationAttributesOverview[] =>
        apps.map((app: Application): ApplicationAttributesOverview => {
          const appName: string = app.attributes.name;
          const deploymentsInfo: DeploymentPreviewInfo[] = app.attributes.deployments.map(
            (dep: Deployment): DeploymentPreviewInfo => ({
              name: dep.attributes.name, version: dep.attributes.version, url: dep.links.application
            })
          );
          return { appName, deploymentsInfo };
        })
      );
  }

}
