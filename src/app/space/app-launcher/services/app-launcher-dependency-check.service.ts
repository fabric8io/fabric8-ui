import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Context } from 'ngx-fabric8-wit';
import { DependencyCheck, DependencyCheckService } from 'ngx-forge';

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

  /**
   * Validate the project name and returns a boolean value
   *
   * @param  {string} projectName
   * @returns boolean
   */
  validateProjectName(projectName: string): boolean {
    // allows only '-', '_' and 4-40 characters (must start with alphabetic and end with alphanumeric)
    // no continuous '-' or '_' is allowed
    const pattern = /^[a-zA-Z](?!.*--)(?!.*__)[a-zA-Z0-9-_]{2,38}[a-zA-Z0-9]$/;
    return pattern.test(projectName);
  }

  /**
   * Validate the artifact id and returns a boolean value
   *
   * @param  {string} artifactId
   * @returns boolean
   */
  validateArtifactId(artifactId: string): boolean {
    // allows only '-'
    return this.validateProjectName(artifactId);
  }

  /**
   * Validates the group id with a regex and returns a boolean value
   *
   * @param  {string} groupId
   * @returns boolean
   */
  validateGroupId(groupId: string): boolean {
    // allows only '.'
    const pattern = /^[a-z][a-z0-9.]{3,63}$/;
    return pattern.test(groupId);
  }

  /**
   * Validates the project version with a regex and returns a boolean value
   *
   * @param  {string} projectVersion
   * @returns boolean
   */
  validateProjectVersion(projectVersion: string): boolean {
    // allows '.' and '-'
    const pattern = /^[a-z0-9][a-z0-9-.]{3,63}$/;
    return pattern.test(projectVersion);
  }
}
