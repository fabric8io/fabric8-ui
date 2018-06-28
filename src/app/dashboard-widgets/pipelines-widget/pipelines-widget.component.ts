import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { User, UserService } from 'ngx-login-client';

import {
  Subscription
} from 'rxjs/Rx';

import { Broadcaster } from 'ngx-base';
import { Context, Contexts } from 'ngx-fabric8-wit';

import { BuildConfigs } from '../../../a-runtime-console/index';

import { PipelinesService } from '../../space/create/pipelines/services/pipelines.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-pipelines-widget',
  templateUrl: './pipelines-widget.component.html'
})
export class PipelinesWidgetComponent implements OnInit, OnDestroy {
  @Input() userOwnsSpace: boolean;
  @Output() addToSpace = new EventEmitter();

  private subscriptions: Subscription[] = [];

  contextPath: string;
  buildConfigs: BuildConfigs;
  private loggedInUser: User;
  private ctx: Context;
  buildConfigsCount: number = 0;
  loading: boolean = true;

  constructor(
    private context: Contexts,
    private broadcaster: Broadcaster,
    private pipelinesService: PipelinesService,
    private userService: UserService
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

    this.subscriptions.push(this.pipelinesService.getCurrentPipelines().share().subscribe(
      (configs: BuildConfigs) => {
        setTimeout(() => {
          this.buildConfigsCount = configs.length;
          this.buildConfigs = configs;
          this.loading = false;
        });
      }
    ));

    this.subscriptions.push(this.userService.loggedInUser.subscribe((user: User) => {
      this.loggedInUser = user;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
