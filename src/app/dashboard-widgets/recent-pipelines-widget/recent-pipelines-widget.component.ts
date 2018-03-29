import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Contexts } from 'ngx-fabric8-wit';
import { ConnectableObservable, Observable } from 'rxjs/Rx';
import { BuildConfigs } from '../../../a-runtime-console/index';
import { PipelinesService } from '../../shared/runtime-console/pipelines.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-recent-pipelines-widget',
  templateUrl: './recent-pipelines-widget.component.html',
  styleUrls: ['./recent-pipelines-widget.component.less']
})
export class RecentPipelinesWidgetComponent implements OnInit {

  contextPath: Observable<string>;
  buildConfigs: ConnectableObservable<BuildConfigs>;
  buildConfigsCount: Observable<number>;

  constructor(
    private context: Contexts,
    private pipelinesService: PipelinesService
  ) {}

  ngOnInit() {
    this.contextPath = this.context.default.map(context => context.path);
    this.buildConfigs = this.pipelinesService.recentPipelines
      .publish();
    this.buildConfigsCount = this.buildConfigs.map(buildConfigs => buildConfigs.length);
    this.buildConfigs.connect();
  }

}
