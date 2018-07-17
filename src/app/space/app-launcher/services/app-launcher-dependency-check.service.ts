import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Context } from 'ngx-fabric8-wit';
import { DependencyCheck, DependencyCheckService } from 'ngx-launcher';

import { ContextService } from '../../../shared/context.service';
import { Application, DeploymentApiService } from '../../create/deployments/services/deployment-api.service';

@Injectable()
export class AppLauncherDependencyCheckService implements DependencyCheckService {
  private context: Context;
  constructor(private deploymentApiService: DeploymentApiService, private contextService: ContextService) {
    this.contextService.current.subscribe(context => this.context = context);
  }

  /**
   * Returns project dependencies
   *
   * @returns {Observable<DependencyCheck>} Project dependencies
   */
  getDependencyCheck(): Observable<DependencyCheck> {
      return Observable.of({
        mavenArtifact: 'booster-mission-runtime',
        groupId: 'io.openshift.booster',
        projectName: '',
        projectVersion: '1.0.0',
        spacePath: '/' + (this.context.space ? this.context.space.id : '')
      });
  }

  /**
   * Returns available projects in a space
   *
   * @returns Observable
   */
  getApplicationsInASpace(): Observable<Application[]> {
    return this.deploymentApiService.getApplications(this.context.space ? this.context.space.id : '');
  }

}
