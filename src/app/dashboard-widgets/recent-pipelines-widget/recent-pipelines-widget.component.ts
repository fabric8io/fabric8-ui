import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { Observable, Subscription } from 'rxjs/Rx';
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
export class RecentPipelinesWidgetComponent implements OnInit, OnDestroy {

  contextPath: string;
  buildConfigs: BuildConfigs;
  buildConfigsCount: number;
  loading: boolean = true;

  private subscriptions: Subscription[] = [];

  constructor(
    private context: Contexts,
    private pipelinesService: PipelinesService
  ) { }

  ngOnInit() {
    // these values changing asynchronously triggers changes in the DOM;
    // force Angular Change Detection via setTimeout encapsulation
    this.subscriptions.push(this.context.current.subscribe(
      (ctx: Context) => {
        setTimeout(() => {
          this.contextPath = ctx.path;
        });
      }));

    this.subscriptions.push(this.pipelinesService.getRecentPipelines().share().subscribe(
      (configs: BuildConfigs) => {
        setTimeout(() => {
          this.buildConfigsCount = configs.length;
          this.buildConfigs = configs;
          this.loading = false;
        });
      }
    ));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
