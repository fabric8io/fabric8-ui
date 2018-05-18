import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DependencyCheck, DependencyCheckService } from 'ngx-forge';

import { Application, DeploymentApiService } from '../../create/deployments/services/deployment-api.service';

@Injectable()
export class AppLauncherDependencyCheckService implements DependencyCheckService {

  constructor(private deploymentApiService: DeploymentApiService) {}

  /**
   * Returns project dependencies
   *
   * @returns {Observable<DependencyCheck>} Project dependencies
   */
  getDependencyCheck(): Observable<DependencyCheck> {
    return Observable.of({
      mavenArtifact: 'booster-mission-runtime',
      groupId: 'io.openshift.booster',
      projectName: 'app-test-1',
      projectVersion: '1.0.0',
      spacePath: '/myspace'
    });
  }

  /**
   * Returns available projects in a space
   *
   * @param  {string} spaceId
   * @returns Observable
   */
  getApplicationsInASpace(spaceId: string): Observable<Application[]> {
    return this.deploymentApiService.getApplications(spaceId);
  }

  /**
   * Validate the project name and returns a boolean value
   *
   * @param  {string} projectName
   * @returns boolean
   */
  validateProjectName(projectName: string): boolean {
    // allows only '-', '_', ' ' and 4-40 characters (must start and end with alphanumeric)
    const pattern = /^[a-zA-Z0-9][a-zA-Z0-9-_\s]{2,38}[a-zA-Z0-9]$/;
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
