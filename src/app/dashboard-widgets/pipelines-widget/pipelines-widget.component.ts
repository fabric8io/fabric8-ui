import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import {
  Observable
} from 'rxjs/Rx';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';

import { BuildConfigs } from '../../../a-runtime-console/index';
import { DummyService } from './../shared/dummy.service';

import { PipelinesService } from '../../space/create/pipelines/services/pipelines.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-pipelines-widget',
  templateUrl: './pipelines-widget.component.html',
  styleUrls: ['./pipelines-widget.component.less'],
  providers: [
    PipelinesService
  ]
})
export class PipelinesWidgetComponent implements OnInit {

  @Output() addToSpace = new EventEmitter();

  contextPath: Observable<string>;
  buildConfigs: Observable<BuildConfigs>;
  buildConfigsCount: number = 0;

  constructor(
    private context: Contexts,
    private broadcaster: Broadcaster,
    private pipelinesService: PipelinesService
  ) {}

  ngOnInit() {
    this.contextPath = this.context.current.map(context => context.path);
    this.buildConfigs = this.pipelinesService.getCurrentPipelines();
    // buildConfigsCount triggers changes in the DOM; force Angular Change Detection
    // via setTimeout encapsulation
    this.buildConfigs
      .map(buildConfigs => buildConfigs.length)
      .subscribe(length => setTimeout(() => this.buildConfigsCount = length));
  }

}
