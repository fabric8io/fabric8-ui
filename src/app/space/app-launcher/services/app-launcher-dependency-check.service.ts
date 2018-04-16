import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DependencyCheck, DependencyCheckService } from 'ngx-forge';

@Injectable()
export class AppLauncherDependencyCheckService implements DependencyCheckService {
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
   * Validate the project name and returns a boolean value
   *
   * @param  {string} projectName
   * @returns boolean
   */
  validateProjectName(projectName: string): boolean {
    // allows only '-'
    const pattern = /^[a-z][a-z0-9-]{3,63}$/;
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
