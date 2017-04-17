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

import {StackAnalysesService, getStackRecommendations} from 'fabric8-stack-analysis-ui';

@Component({
  selector: 'fabric8-analytical-report-widget',
  templateUrl: './analytical-report-widget.component.html',
  styleUrls: ['./analytical-report-widget.component.scss'],
  providers: [
    StackAnalysesService
  ]
})
export class AnalyticalReportWidgetComponent implements OnInit {

  buildConfigs: Observable<BuildConfigs>;
  buildConfigsCount: Observable<number>;

  currentPipeline: BuildConfig;
  currentPipelineBuilds: Array<Build>;

  currentBuild: Build;
  stackAnalysisInformation: any = {
    recommendationsLimit: 5
  };

  constructor(
    private context: Contexts,
    private broadcaster: Broadcaster,
    private pipelinesService: PipelinesService,
    private stackAnalysisService: StackAnalysesService
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
    this.currentPipelineBuilds = pipeline.builds;
  }

  selectedBuild(): void {
    let build: Build = this.currentBuild;
    if (build.annotations['fabric8.io/bayesian.analysisUrl']) {
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


                for (let i in missing) {
                  if (missing.hasOwnProperty(i)) {
                    let keys: Array<string> = Object.keys(missing[i]);
                    recommendations.push({
                      suggestion: 'Recommendation',
                      action: 'Add',
                      message: keys[0] + ' : ' + missing[i][keys[0]]
                    });
                  }
                }
                for (let i in version) {
                  if (version.hasOwnProperty(i)) {
                    let keys: Array<string> = Object.keys(version[i]);
                    recommendations.push({
                      suggestion: 'Recommendation',
                      action: 'Update',
                      message: keys[0] + ' : ' + version[i][keys[0]]
                    });
                  }
                }

                this.stackAnalysisInformation['recommendations'] = recommendations;
                // Restrict the recommendations to a particular limit as specified in UX
                this.stackAnalysisInformation['recommendations'].splice(this.stackAnalysisInformation['recommendationsLimit']);
              });
            }
        });
      }
  }

}
