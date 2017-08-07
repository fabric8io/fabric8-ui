import { Component, Input, OnDestroy, OnInit } from '@angular/core';
//
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';


@Component({
  selector: 'app-generator-build-pipeline-view',
  templateUrl: './app-generator-build-pipeline-view.component.html',
  styleUrls: [ './app-generator-build-pipeline-view.component.less' ]
})
export class AppGeneratorBuildPipelineViewComponent implements OnInit, OnDestroy {

  // keep track of the number of instances
  static instanceCount: number = 1;

  @Input() public buildPipeline: any = {
    stages: [
      { name: 'Release', color: 'success' , icon: 'fa-check-circle' },
      { name: 'Test', color: 'success' , icon: 'fa-check-circle' },
      { name: 'Stage', color: 'success' , icon: 'fa-check-circle' },
      { name: 'Approve', color: 'warning' , icon: 'fa-pause-circle' }
    ]};

  constructor(
    loggerFactory: LoggerFactory) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, AppGeneratorBuildPipelineViewComponent.instanceCount++);
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
