import { Component, Input, OnDestroy, OnInit } from '@angular/core';
//
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import { IWorkflow } from '../../models/workflow';
import { ForgeAppGenerator } from './forge-app-generator';
import { AppGeneratorConfiguratorService } from '../../services/app-generator.service';

@Component({
  selector: 'space-configurator',
  templateUrl: './space-configurator.component.html',
  styleUrls: [ './space-configurator.component.less' ]
})
export class SpaceConfiguratorComponent implements OnInit, OnDestroy {

  // keep track of the number of instances
  static instanceCount: number = 1;

  @Input() workflow: IWorkflow;

  constructor(
    public configurator: AppGeneratorConfiguratorService,
    loggerFactory: LoggerFactory) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, SpaceConfiguratorComponent.instanceCount++);
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
