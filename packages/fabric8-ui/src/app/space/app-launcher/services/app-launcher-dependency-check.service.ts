import { Injectable, Injector } from '@angular/core';
import { Context } from 'ngx-fabric8-wit';
import { DependencyCheck, DependencyCheckService } from 'ngx-launcher';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContextService } from '../../../shared/context.service';
import { PipelinesService } from '../../../shared/runtime-console/pipelines.service';
import { BuildConfig } from '../../../../a-runtime-console';

@Injectable()
export class AppLauncherDependencyCheckService implements DependencyCheckService {
  private context: Context;

  private pipelinesService: PipelinesService;

  constructor(private contextService: ContextService, private injector: Injector) {
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
    if (!this.pipelinesService) {
      this.pipelinesService = this.injector.get(PipelinesService);
    }
    return this.pipelinesService.current.pipe(
      map((buildConfigs: BuildConfig[]) => {
        if (buildConfigs) {
          return buildConfigs.map((bc) => ({ attributes: { name: bc.name } }));
        }
      }),
    );
  }
}
