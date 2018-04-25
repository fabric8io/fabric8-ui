import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Contexts } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Rx';
import { BuildConfigs } from '../../../a-runtime-console/index';

import { PipelinesService } from '../../space/create/pipelines/services/pipelines.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-recent-pipelines-widget',
  templateUrl: './recent-pipelines-widget.component.html',
  styleUrls: ['./recent-pipelines-widget.component.less'],
  providers: [
    PipelinesService
  ]
})
export class RecentPipelinesWidgetComponent implements OnInit {

  contextPath: Observable<string>;
  buildConfigs: Observable<BuildConfigs>;
  buildConfigsCount: number;

  constructor(
    private context: Contexts,
    private pipelinesService: PipelinesService
  ) {}

  ngOnInit() {
    this.contextPath = this.context.default.map(context => context.path);
    this.buildConfigs = this.pipelinesService.getRecentPipelines().share();
    // buildConfigsCount triggers changes in the DOM; force Angular Change Detection
    // via setTimeout encapsulation
    this.buildConfigs
      .map(buildConfigs => buildConfigs.length)
      .subscribe(length => setTimeout(() => this.buildConfigsCount = length));
  }

}
