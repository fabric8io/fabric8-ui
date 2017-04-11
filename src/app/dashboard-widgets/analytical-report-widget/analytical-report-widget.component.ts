import { PipelinesService } from './../../shared/runtime-console/pipelines.service';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';

import {
  BuildConfig,
  BuildConfigs,
  Build
} from 'fabric8-runtime-console';

@Component({
  selector: 'fabric8-analytical-report-widget',
  templateUrl: './analytical-report-widget.component.html',
  styleUrls: ['./analytical-report-widget.component.scss']
})
export class AnalyticalReportWidgetComponent implements OnInit {

  buildConfigs: Observable<BuildConfigs>;
  buildConfigsCount: Observable<number>;

  currentPipeline: BuildConfig;
  currentPipelineBuilds: Array<Build>;

  constructor(
    private context: Contexts,
    private broadcaster: Broadcaster,
    private pipelinesService: PipelinesService
  ) { }

  ngOnInit() {
    this.context.current.subscribe(context => console.log('Context', context));

    let bcs = this.pipelinesService.current
      .publish();
    this.buildConfigs = bcs;
    this.buildConfigsCount = bcs.map(buildConfigs => buildConfigs.length);
    bcs.connect();
  }

  selectedPipeline(): void {
    let pipeline: BuildConfig = this.currentPipeline;
    this.currentPipelineBuilds = pipeline.interestingBuilds;
  }

}
