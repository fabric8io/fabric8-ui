import { Component, Input, OnDestroy, OnInit } from '@angular/core';
//
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';

import { ForgeAppGenerator } from './forge-app-generator';

import {
  IField
} from '../../services/app-generator.service';

import { Fabric8AppGeneratorClient } from '../../services/fabric8-app-generator.client';
import { FieldWidgetClassificationOptions } from '../../models/contracts/field-classification';

@Component({
  selector: 'app-generator-single-input',
  templateUrl: './app-generator-single-input.component.html',
  styleUrls: [ './app-generator-single-input.component.less' ]
})
export class AppGeneratorSingleInputComponent implements OnInit, OnDestroy {

  // keep track of the number of instances
  static instanceCount: number = 1;

  @Input() field: IField = <IField>{ name: '', value: '', display: { choices: [] }};
  @Input() appGenerator: Fabric8AppGeneratorClient;


  constructor(
    loggerFactory: LoggerFactory) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, AppGeneratorSingleInputComponent.instanceCount++);
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

