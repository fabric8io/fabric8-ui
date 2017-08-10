import { PipelinesService } from './../../shared/runtime-console/pipelines.service';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';

import {
  BuildConfig,
  BuildConfigs,
  combineBuildConfigAndBuilds,
  filterPipelines,
  BuildConfigStore,
  BuildStore
} from '../../../a-runtime-console/index';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-recent-pipelines-widget',
  templateUrl: './recent-pipelines-widget.component.html',
  styleUrls: ['./recent-pipelines-widget.component.less']
})
export class RecentPipelinesWidgetComponent implements OnInit, OnDestroy {

  buildConfigs: Observable<BuildConfigs>;
  buildConfigsCount: Observable<number>;
  contextPath: Observable<string>;
  bcs: any;

  constructor(
    private context: Contexts,
    private pipelinesService: PipelinesService
  ) { }

  ngOnInit() {
    this.contextPath = this.context.current.map(context => context.path);
    this.bcs = this.pipelinesService.recentPipelines
      .publish();
    this.buildConfigs = this.bcs;
    this.buildConfigsCount = this.bcs.do((object) => {
      return object;
    }).map(buildConfigs => buildConfigs.length);
    this.bcs.connect();
  }

  ngOnDestroy() {

  }

}
