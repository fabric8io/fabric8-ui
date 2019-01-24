import { Injectable } from '@angular/core';
import { Context } from 'ngx-fabric8-wit';
import { DependencyCheck, DependencyCheckService } from 'ngx-launcher';
import { Observable, of as observableOf } from 'rxjs';
import { ContextService } from '../../../shared/context.service';
import { of } from 'rxjs';

@Injectable()
export class AppLauncherDependencyCheckService implements DependencyCheckService {
  private context: Context;
  constructor(
    private contextService: ContextService,
  ) {
    this.contextService.current.subscribe((context) => (this.context = context));
  }

  /**
   * Returns project dependencies
   *
   * @returns {Observable<DependencyCheck>} Project dependencies
   */
  getDependencyCheck(): Observable<DependencyCheck> {
    return observableOf({
      mavenArtifact: 'booster-mission-runtime',
      groupId: 'io.openshift.booster',
      projectName: '',
      projectVersion: '1.0.0',
      spacePath: `/${this.context && this.context.space ? this.context.space.id : ''}`,
      targetEnvironment: 'os',
    });
  }

  /**
   * Returns available projects in a space
   *
   * @returns Observable
   */
  getApplicationsInASpace(): Observable<any[]> {
    return of([])
  }
}
