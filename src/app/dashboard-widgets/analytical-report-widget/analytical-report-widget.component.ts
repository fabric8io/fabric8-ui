import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs/Rx';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';

import {
  Build,
  BuildConfig,
  BuildConfigs
} from '../../../a-runtime-console/index';
import { PipelinesService } from '../../shared/runtime-console/pipelines.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-analytical-report-widget',
  templateUrl: './analytical-report-widget.component.html',
  styleUrls: ['./analytical-report-widget.component.less']
})
export class AnalyticalReportWidgetComponent implements OnInit, OnDestroy {

  buildConfigs: Observable<BuildConfigs>;
  buildConfigsCount: number;

  currentPipeline: string;
  currentPipelineBuilds: Array<Build>;

  pipelines: BuildConfigs;

  stackUrl: string;

  currentBuild: Build;
  stackAnalysisInformation: any = {
    recommendationsLimit: 7,
    showLoader: false,
    recommendations: [],
    finishedTime: ''
  };

  _contextSubscription: Subscription;

  constructor(
    private context: Contexts,
    private broadcaster: Broadcaster,
    private pipelinesService: PipelinesService
  ) {
    this.buildConfigsCount = 0;
  }

  ngOnInit() {
    this._contextSubscription = this.context.current
      .subscribe(context => console.log('Context', context));

    let bcs = this.pipelinesService.current
      .publish();
    this.buildConfigs = bcs;

    this.buildConfigs.subscribe((data) => {
      this.pipelines = this.filterPipelines(data);
      if (this.pipelines.length !== 0) {
        if (this.currentPipeline !== this.pipelines[0].id) {
          this.currentPipeline = this.pipelines[0].id;
          this.selectedPipeline();
        }
      } else {
        this.currentPipeline = 'default';
      }
      this.buildConfigsCount = this.pipelines.length;
    });
    bcs.connect();
  }

  ngOnDestroy() {
    this._contextSubscription.unsubscribe();
  }

  filterPipelines(buildConfs: Array<any>): Array<any> {
    return buildConfs.filter(item => {
      let returnStatement: boolean = false;
      if (item && item.interestingBuilds && item.interestingBuilds.length > 0) {
        for (let build of item.interestingBuilds) {
          if (build.annotations['fabric8.io/bayesian.analysisUrl']) {
            returnStatement = true;
            break;
          }
        }
      }
      return returnStatement;
    });
  }

  selectedPipeline(): void {
    let pipeline: BuildConfig = this.pipelines.find(val => val.id === this.currentPipeline);
    this.currentPipelineBuilds = pipeline.interestingBuilds;
    this.currentBuild = null;
    for (let build of this.currentPipelineBuilds) {
      if (build.annotations['fabric8.io/bayesian.analysisUrl']) {
        this.currentBuild = build;
        break;
      }
    }
    this.selectedBuild();
  }

  showLoader(): void {
    this.stackAnalysisInformation['showLoader'] = true;
  }

  hideLoader(): void {
    this.stackAnalysisInformation['showLoader'] = false;
  }

  selectedBuild(): void {
    let build: Build = this.currentBuild;
    this.showLoader();
    this.stackUrl = '';
    if (build) {
      this.stackUrl = build.annotations['fabric8.io/bayesian.analysisUrl'];
    } else {
      this.currentBuild = null;
      this.hideLoader();
    }
  }

}
