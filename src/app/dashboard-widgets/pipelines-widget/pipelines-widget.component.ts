import { PipelinesService } from './../../shared/runtime-console/pipelines.service';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
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

import { Fabric8RuntimeConsoleService } from './../../shared/runtime-console/fabric8-runtime-console.service';

import { DummyService } from './../shared/dummy.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-pipelines-widget',
  templateUrl: './pipelines-widget.component.html',
  styleUrls: ['./pipelines-widget.component.less']
})
export class PipelinesWidgetComponent implements OnInit {

  @Output() addToSpace = new EventEmitter();

  buildConfigs: Observable<BuildConfigs>;
  buildConfigsCount: Observable<number>;
  contextPath: Observable<string>;

  constructor(
    private context: Contexts,
    private broadcaster: Broadcaster,
    private pipelinesService: PipelinesService
  ) { }

  ngOnInit() {
    this.contextPath = this.context.current.map(context => context.path);
    let bcs = this.pipelinesService.current
      .publish();
    this.buildConfigs = bcs;
    this.buildConfigsCount = bcs.map(buildConfigs => buildConfigs.length);
    bcs.connect();
  }

}
