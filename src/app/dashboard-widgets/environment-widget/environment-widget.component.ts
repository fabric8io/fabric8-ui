import { Component, OnInit, Output, OnDestroy, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs/Rx';

import { Contexts, Context } from 'ngx-fabric8-wit';
import { PipelinesService } from '../../shared/runtime-console/pipelines.service';

import {
  BuildConfigs
} from 'fabric8-runtime-console';

import { appInfos } from 'fabric8-runtime-console/src/app/kubernetes/model/buildconfig.model';


@Component({
  selector: 'fabric8-environment-widget',
  templateUrl: './environment-widget.component.html',
  styleUrls: ['./environment-widget.component.scss']
})
export class EnvironmentWidgetComponent implements OnInit, OnDestroy {

  contextPath: Observable<string>;
  buildConfigs: Observable<BuildConfigs>;
  appsCount: number = 0;
  appSubscription: Subscription;
  contextSubscription: Subscription;
  currentContext: Context;
  loadedEnvironments = [];

  constructor(private context: Contexts,
              private pipelinesService: PipelinesService) {
  }

  ngOnInit() {
    this.contextSubscription = this.context.current.subscribe((context) => {
      this.currentContext = context;
    });
    this.contextPath = this.context.current.map(context => context.path);
    let bcs = this.pipelinesService.current
      .publish();
    this.buildConfigs = bcs;
    let environmentAppInfo = this.buildConfigs.map(appInfos);
    this.appSubscription = environmentAppInfo.subscribe((environments) => {
      let keys = Object.keys(environments);
      // reset environments array
      this.loadedEnvironments = [];
      keys.forEach((key) => {
        if(environments[key].apps[this.currentContext.space.attributes.name]) {
          this.loadedEnvironments.push({
            "name": key,
            "apps": environments[key].apps[this.currentContext.space.attributes.name]
          });
        }
      });
      this.appsCount = this.loadedEnvironments.length;
    });
    bcs.connect();
  }

  ngOnDestroy() {
    this.appSubscription.unsubscribe();
    this.contextSubscription.unsubscribe();
  }
}
