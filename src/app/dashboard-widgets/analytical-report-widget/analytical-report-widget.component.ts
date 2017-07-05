import { PipelinesService } from './../../shared/runtime-console/pipelines.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';

import {
  BuildConfig,
  BuildConfigs,
  Build
} from 'fabric8-runtime-console';

import { StackAnalysesService, getStackRecommendations } from 'fabric8-stack-analysis-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-analytical-report-widget',
  templateUrl: './analytical-report-widget.component.html',
  styleUrls: ['./analytical-report-widget.component.less'],
  providers: [
    StackAnalysesService
  ]
})
export class AnalyticalReportWidgetComponent implements OnInit, OnDestroy {

  buildConfigs: Observable<BuildConfigs>;
  buildConfigsCount: Observable<number>;

  currentPipeline: string;
  currentPipelineBuilds: Array<Build>;

  pipelines: BuildConfigs;

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
    private pipelinesService: PipelinesService,
    private stackAnalysisService: StackAnalysesService
  ) {
  }

  ngOnInit() {
    this._contextSubscription = this.context.current
      .subscribe(context => console.log('Context', context));

    let bcs = this.pipelinesService.current
      .publish();
    this.buildConfigs = bcs;

    this.buildConfigs.subscribe((data) => {
      this.pipelines = data;
      let filteredPipelines = this.filterPipelines(data);
      if (filteredPipelines.length !== 0) {
        if (this.currentPipeline !== filteredPipelines[0].id) {
          this.currentPipeline = filteredPipelines[0].id;
          this.selectedPipeline();
        }
      } else {
        this.currentPipeline = 'default';
      }
    });
    this.buildConfigsCount = bcs.map(buildConfigs => buildConfigs.length);
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
    if (build) {
      let url: string = build.annotations['fabric8.io/bayesian.analysisUrl'];
      this.stackAnalysisService
        .getStackAnalyses(url)
        .subscribe((data) => {
          let recommendationsObservable = getStackRecommendations(data);
          if (recommendationsObservable) {
            let recommendations: Array<any> = [];
            recommendationsObservable.subscribe((result) => {
              let missing: Array<any> = result.missing || [];
              let version: Array<any> = result.version || [];

              let stackName: string = result['stackName'] || 'An existing stack';

              for (let i in missing) {
                if (missing.hasOwnProperty(i)) {
                  let keys: Array<string> = Object.keys(missing[i]);
                  recommendations.push({
                    suggestion: 'Recommendation',
                    action: 'Add',
                    message: keys[0] + ' : ' + missing[i][keys[0]],
                    subMessage: stackName + ' has this dependency included'
                  });
                }
              }
              for (let i in version) {
                if (version.hasOwnProperty(i)) {
                  let keys: Array<string> = Object.keys(version[i]);
                  recommendations.push({
                    suggestion: 'Recommendation',
                    action: 'Update',
                    message: keys[0] + ' : ' + version[i][keys[0]],
                    subMessage: stackName + ' has a different version of dependency'
                  });
                }
              }

              this.stackAnalysisInformation['recommendations'] = recommendations;
              // Restrict the recommendations to a particular limit as specified in UX
              this.stackAnalysisInformation['recommendations'].splice(this.stackAnalysisInformation['recommendationsLimit']);
              let finishedTime: string = result.finishedTime;
              if (finishedTime) {
                let date = null;
                try {
                  date = new Date(finishedTime);
                  let options: any = { year: 'numeric', month: 'long', day: 'numeric', time: 'numeric' };
                  finishedTime = date.toLocaleDateString('en-US', options);
                } catch (error) {

                }
              }
              this.stackAnalysisInformation['finishedTime'] = 'Report Completed ' + finishedTime;

            });
          } else {
            this.stackAnalysisInformation['recommendations'].length = 0;
          }
          this.hideLoader();
        });
    } else {
      this.currentBuild = null;
      this.hideLoader();
    }
  }

}
