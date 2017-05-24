import { Component, Input, OnDestroy, OnInit } from '@angular/core';
//
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';

import { ForgeAppGenerator } from './forge-app-generator';

@Component({
  selector: 'forge-pipeline-view',
  templateUrl: './forge-pipeline-view.component.html',
  styleUrls: [ './forge-pipeline-view.component.scss' ]
})
export class ForgePipelineViewComponent implements OnInit, OnDestroy {

  // keep track of the number of instances
  static instanceCount: number = 1;

  @Input() public pipeline: any = {
    stages: [
      { name: 'Release', color: 'success' , icon: 'fa-check-circle' },
      { name: 'Test', color: 'success' , icon: 'fa-check-circle' },
      { name: 'Stage', color: 'success' , icon: 'fa-check-circle' },
      { name: 'Approve', color: 'warning' , icon: 'fa-pause-circle' }
    ]};

  constructor(
    loggerFactory: LoggerFactory) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, ForgePipelineViewComponent.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.log(`New instance ...`);
  }

  ngOnInit() {
    this.log(`ngOnInit ...`);
  }

  ngOnDestroy() {
    this.log(`ngOnDestroy ...`);
  }
  /** logger delegate delegates logging to a logger */
  private log: ILoggerDelegate = () => {};

}

