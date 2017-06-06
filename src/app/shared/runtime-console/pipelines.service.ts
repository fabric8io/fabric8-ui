import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  BuildConfig,
  BuildConfigs,
  combineBuildConfigAndBuilds,
  filterPipelines,
  BuildConfigStore,
  BuildStore, Builds
} from 'fabric8-runtime-console';

import { Fabric8RuntimeConsoleService } from './fabric8-runtime-console.service';
import { Context, Contexts } from 'ngx-fabric8-wit';


@Injectable()
export class PipelinesService {

  constructor(
    private contexts: Contexts,
    private pipelinesStore: BuildConfigStore,
    private buildStore: BuildStore,
    private fabric8RuntimeConsoleService: Fabric8RuntimeConsoleService
  ) { }

  get current(): Observable<BuildConfig[]> {
    return this.fabric8RuntimeConsoleService
      .loading()
      .switchMap(() =>
        Observable.combineLatest(
          this.pipelinesStore
            .loadAll()
            .distinctUntilChanged(),
          this.buildStore
            .loadAll()
            .distinctUntilChanged(),
          this.contexts.current,
          combineBuildConfigAndBuildsAndFilterOnSpace))
      .map(filterPipelines);
  }
}

function combineBuildConfigAndBuildsAndFilterOnSpace(buildConfigs: BuildConfigs, builds: Builds, context: Context): BuildConfigs {
  let pipelines = combineBuildConfigAndBuilds(buildConfigs, builds);
  let spaceId = "";
  if (context) {
    spaceId = context.name;
  }
  if (!spaceId) {
    return pipelines;
  }
  let answer = new BuildConfigs();
  pipelines.forEach(bc => {
    let bcSpace = bc.labels['space'];
    if (!bcSpace || bcSpace === spaceId) {
      answer.push(bc);
    }
  });
  return answer;
}
