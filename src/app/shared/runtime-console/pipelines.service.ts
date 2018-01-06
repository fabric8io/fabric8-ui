import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { orderBy, take } from 'lodash';

import {
  BuildConfig,
  BuildConfigs,
  combineBuildConfigAndBuilds,
  filterPipelines,
  BuildConfigStore,
  BuildStore, Builds
} from '../../../a-runtime-console/index';

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

  get recentPipelines(): Observable<BuildConfig[]> {
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
          filterByMostRecent))
      .map(filterPipelines);
  }
}

function combineBuildConfigAndBuildsAndFilterOnSpace(buildConfigs: BuildConfigs, builds: Builds, context: Context): BuildConfigs {
  let pipelines = combineBuildConfigAndBuilds(buildConfigs, builds);
  let spaceId = '';
  if (context) {
    let paths = context.path.split('/');
    if (paths[paths.length - 1]) {
      spaceId = paths[paths.length - 1];
    }
  }
  if (!spaceId) {
    return pipelines;
  }
  let answer = new BuildConfigs();
  pipelines.forEach(bc => {
    let bcSpace = bc.labels['space'];
    if (bcSpace === spaceId) {
      answer.push(bc);
    }
  });
  return answer;
}

function filterByMostRecent(buildConfigs: BuildConfigs, builds: Builds): BuildConfigs {
  let pipelines = combineBuildConfigAndBuilds(buildConfigs, builds);
  let sortedPipelines = orderBy(pipelines, (pipeline) => {
    if (pipeline && pipeline.lastBuild) {
      return new Date(pipeline.lastBuild.creationTimestamp);
    }
    return new Date(0);
  }, ['desc']);

  let answer = new BuildConfigs();
  sortedPipelines.forEach(bc => {
    if (bc.statusPhase !== 'Complete' && bc.labels['space']) {
      answer.push(bc);
    }
  });
  return take(answer, 4);
}
