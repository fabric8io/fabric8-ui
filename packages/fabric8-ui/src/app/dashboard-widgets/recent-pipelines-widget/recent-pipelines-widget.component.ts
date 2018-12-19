import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { share } from 'rxjs/operators';
import { BuildConfigs } from '../../../a-runtime-console/index';
import { ContextService } from '../../shared/context.service';
import { PipelinesService } from '../../space/create/pipelines/services/pipelines.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-recent-pipelines-widget',
  templateUrl: './recent-pipelines-widget.component.html',
  styleUrls: ['./recent-pipelines-widget.component.less'],
  providers: [PipelinesService],
})
export class RecentPipelinesWidgetComponent implements OnInit, OnDestroy {
  contextPath: string;
  buildConfigs: BuildConfigs;
  buildConfigsCount: number;
  loading: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(private pipelinesService: PipelinesService, private contextService: ContextService) {}

  ngOnInit() {
    // these values changing asynchronously triggers changes in the DOM;
    // force Angular Change Detection via setTimeout encapsulation
    this.subscriptions.push(
      this.pipelinesService
        .getRecentPipelines()
        .pipe(share())
        .subscribe((configs: BuildConfigs) => {
          this.loading = true;
          setTimeout(() => {
            this.buildConfigsCount = configs.length;
            this.buildConfigs = configs;
            this.loading = false;
          });
        }),
    );
    this.contextPath = this.contextService.currentUser;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
