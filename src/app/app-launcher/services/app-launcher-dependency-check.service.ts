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
      mavenArtifact: 'd4.345',
      groupId: '124-644',
      projectName: 'App_test_1',
      projectVersion: '124.554',
      spacePath: '/myspace'
    });
  }
}
