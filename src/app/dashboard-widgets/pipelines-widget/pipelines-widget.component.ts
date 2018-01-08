import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { Observable } from 'rxjs/Rx';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';

import { BuildConfigs } from '../../../a-runtime-console/index';
import { PipelinesService } from '../../shared/runtime-console/pipelines.service';
import { DummyService } from './../shared/dummy.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-pipelines-widget',
  templateUrl: './pipelines-widget.component.html',
  styleUrls: ['./pipelines-widget.component.less']
})
export class PipelinesWidgetComponent implements OnInit {

  @Output() addToSpace = new EventEmitter();

  buildConfigs: Observable<BuildConfigs>;
  buildConfigsCount: Observable<number>;
  contextPath: Observable<string>;

  constructor(
    private context: Contexts,
    private broadcaster: Broadcaster,
    private pipelinesService: PipelinesService
  ) { }

  ngOnInit() {
    this.contextPath = this.context.current.map(context => context.path);
    let bcs = this.pipelinesService.current
      .publish();
    this.buildConfigs = bcs;
    this.buildConfigsCount = bcs.map(buildConfigs => buildConfigs.length);
    bcs.connect();
  }

}
