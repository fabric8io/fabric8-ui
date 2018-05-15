import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import {
  Observable,
  Subscription
} from 'rxjs/Rx';

import { Broadcaster } from 'ngx-base';
import { Context, Contexts } from 'ngx-fabric8-wit';

import { BuildConfig, BuildConfigs } from '../../../a-runtime-console/index';
import { DummyService } from './../shared/dummy.service';

import { PipelinesService } from '../../space/create/pipelines/services/pipelines.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-pipelines-widget',
  templateUrl: './pipelines-widget.component.html',
  providers: [
    PipelinesService
  ]
})
export class PipelinesWidgetComponent implements OnInit, OnDestroy {

  @Output() addToSpace = new EventEmitter();

  private subscriptions: Subscription[] = [];

  contextPath: string;
  buildConfigs: BuildConfigs;
  buildConfigsCount: number = 0;

  constructor(
    private context: Contexts,
    private broadcaster: Broadcaster,
    private pipelinesService: PipelinesService
  ) {}

  ngOnInit() {
    // these values changing asynchronously triggers changes in the DOM;
    // force Angular Change Detection via setTimeout encapsulation

    this.subscriptions.push(this.context.current.subscribe(
      (ctx: Context) => {
        setTimeout(() => {
          this.contextPath = ctx.path;
        });
      }));

    this.subscriptions.push(this.pipelinesService.getCurrentPipelines().share().subscribe(
      (configs: BuildConfigs) => {
        setTimeout(() => {
          this.buildConfigsCount = configs.length;
          this.buildConfigs = configs;
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
