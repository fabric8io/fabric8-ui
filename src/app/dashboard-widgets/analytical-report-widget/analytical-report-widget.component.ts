import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { publish } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs/Rx';
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
export class AnalyticalReportWidgetComponent implements OnInit {

  buildConfigs: Observable<BuildConfigs>;
  buildConfigsCount: number;

  currentPipeline: string;
  currentPipelineBuilds: Array<Build>;
  loading: boolean = true;
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
    private pipelinesService: PipelinesService
  ) {
    this.buildConfigsCount = 0;
  }

  ngOnInit() {
    let bcs = this.pipelinesService.current.pipe(
      publish());
    this.buildConfigs = bcs;

    this.buildConfigs.subscribe((data) => {
      this.pipelines = this.filterPipelines(data);
      if (this.pipelines.length !== 0) {
        if (this.currentPipeline !== this.pipelines[0].id) {
          this.currentPipeline = this.pipelines[0].id;
          if (!this.currentBuild) {
            this.selectedPipeline();
          }
        }
      } else {
        this.currentPipeline = 'default';
      }
      this.buildConfigsCount = this.pipelines.length;
      this.loading = false;
    });
    bcs.connect();
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
