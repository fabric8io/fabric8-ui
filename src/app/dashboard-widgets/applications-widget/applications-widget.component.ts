import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';

import { Context, Contexts, Space } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';

import { BuildConfig } from '../../../a-runtime-console/index';
import { PipelinesService } from '../../shared/runtime-console/pipelines.service';

import { cloneDeep, isEmpty, orderBy } from 'lodash';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-applications-widget',
  templateUrl: './applications-widget.component.html',
  styleUrls: ['./applications-widget.component.less']
})
export class ApplicationsWidgetComponent implements OnDestroy, OnInit {
  @Input() userOwnsSpace: boolean;
  @Output() addToSpace = new EventEmitter();

  contextPath: Observable<string>;
  currentSpace: Space;
  loading: boolean = true;
  loggedInUser: User;

  buildConfigs: BuildConfig[];
  runBuildConfigs: BuildConfig[] = [];
  stageBuildConfigs: BuildConfig[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private context: Contexts,
              private pipelinesService: PipelinesService,
              private router: Router,
              private userService: UserService) {
    // Fetch pipeline build configs and filter based on application deployment stage
    this.subscriptions.push(
      this.pipelinesService.current.subscribe((buildConfigs: BuildConfig[]) => {
        this.buildConfigs = buildConfigs;
        this.filterRunBuildConfigs();
        this.filterStageBuildConfigs();
        this.sortBuildConfigs();
        this.alignBuildConfigs();
        this.loading = false;
      }));
    this.subscriptions.push(userService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
    }));
    this.subscriptions.push(context.current.subscribe((ctx: Context) => {
      this.currentSpace = ctx.space;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
  }

  get applicationsInProgress(): number {
    let result = 0;
    if (this.buildConfigsAvailable) {
      result = this.buildConfigs.length - (this.stageBuildConfigs.length + this.runBuildConfigs.length);
    }
    return result;
  }

  get buildConfigsAvailable(): boolean {
    return !(isEmpty(this.buildConfigs));
  }

  get runConfigsAvailable(): boolean {
    return !(isEmpty(this.runBuildConfigs));
  }

  get stageConfigsAvailable(): boolean {
    return !(isEmpty(this.stageBuildConfigs));
  }

  // Private

  // Filter pipeline buildConfigs based on application deployment stage\
  //
  // Note: The serviceUrls, environmentMap, and serviceEnvironmentMap properties of BuildConfig each provide an
  // environment name. Unfortunately, these properties are not always populated as expected -- may be a fluke?
  private filterBuildConfigs(deploymentEnv: string = 'Run'): BuildConfig[] {
    let result: BuildConfig[] = [];
    if (!isEmpty(this.buildConfigs)) {
      for (let i = 0; i < this.buildConfigs.length; i++) {
        const buildConfig = this.buildConfigs[i];
        if (!isEmpty(buildConfig)) {
          for (let i = 0; i < buildConfig.serviceUrls.length; i++) {
            if (deploymentEnv === buildConfig.serviceUrls[i].environmentName) {
              result.push(buildConfig);
              break;
            }
          }
        }
      }
    }
    return result;
  }

  // Filter pipeline buildConfigs for run deployment
  private filterRunBuildConfigs(): void {
    this.runBuildConfigs = this.filterBuildConfigs('Run');
  }

  // Filter pipeline buildConfigs for stage deployment
  private filterStageBuildConfigs(): void {
    this.stageBuildConfigs = this.filterBuildConfigs('Stage');
  }

  // Sort functions

  // Align build configs visually
  private alignBuildConfigs(): void {
    if (isEmpty(this.stageBuildConfigs) || isEmpty(this.runBuildConfigs)) {
      return;
    }
    if (this.stageBuildConfigs.length > this.runBuildConfigs.length) {
      this.stageBuildConfigs = orderBy(this.stageBuildConfigs, (item) => {
        for (let i = 0; i < this.runBuildConfigs.length; i++) {
          if (this.runBuildConfigs[i].name === item.name) {
            return i;
          }
        }
      });
    }
    if (this.runBuildConfigs.length > this.stageBuildConfigs.length) {
      this.runBuildConfigs = orderBy(this.runBuildConfigs, (item) => {
        for (let i = 0; i < this.stageBuildConfigs.length; i++) {
          if (this.stageBuildConfigs[i].name === item.name) {
            return i;
          }
        }
      });
    }
  }

  // Sort build configs alphabetocally
  private sortBuildConfigs(): void {
    if (!isEmpty(this.stageBuildConfigs)) {
      this.stageBuildConfigs = orderBy(this.stageBuildConfigs, ['name']);
    }
    if (!isEmpty(this.runBuildConfigs)) {
      this.runBuildConfigs = orderBy(this.runBuildConfigs, ['name']);
    }
  }
}
