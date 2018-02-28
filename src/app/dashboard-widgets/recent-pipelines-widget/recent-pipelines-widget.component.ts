import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Contexts } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Rx';

import { BuildConfigs } from '../../../a-runtime-console/index';
import { PipelinesService } from '../../shared/runtime-console/pipelines.service';

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
    this.contextPath = this.context.default.map(context => context.path);
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
