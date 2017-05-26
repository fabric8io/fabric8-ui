import { Component, Input, OnDestroy, OnInit } from '@angular/core';
//
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';

import { IWorkflow } from '../../models/workflow';

import { ForgeAppGenerator } from './forge-app-generator';

import { AppGeneratorConfiguratorService } from '../../services/app-generator.service';

import {
  IAppGeneratorState
} from '../../services/app-generator.service';

@Component({
  selector: 'forge-panel',
  templateUrl: './forge-panel.component.html',
  styleUrls: [ './forge-panel.component.scss' ]
})
export class ForgePanelComponent implements OnInit, OnDestroy {

  // keep track of the number of instances
  static instanceCount: number = 1;

  @Input() workflow: IWorkflow;

  get configurator(): AppGeneratorConfiguratorService {
     return this._configuratorService;
  }

  constructor(
    private _configuratorService: AppGeneratorConfiguratorService,
    loggerFactory: LoggerFactory) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, ForgePanelComponent.instanceCount++);
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

