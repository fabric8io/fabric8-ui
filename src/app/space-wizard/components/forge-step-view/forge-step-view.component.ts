import { Component, Input, OnDestroy, OnInit } from '@angular/core';
//
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';

import { ForgeAppGenerator } from './forge-app-generator';

import {
  IAppGeneratorState
} from '../../services/app-generator.service';

@Component({
  selector: 'forge-step-view',
  templateUrl: './forge-step-view.component.html',
  styleUrls: [ './forge-step-view.component.scss' ]
})
export class ForgeStepViewComponent implements OnInit, OnDestroy {

  // keep track of the number of instances
  static instanceCount: number = 1;

  @Input() public sequence: any = {
    steps: [
      { name: '1', active: true  },
      { name: '2', active: false },
      { name: '3', active: false  },
      { name: '4', active: false  },
      { name: '5', active: false  }
    ]};

  private _state: IAppGeneratorState = <IAppGeneratorState>{currentStep: 0, steps: []};
  @Input()
  public set state(value: IAppGeneratorState) {
     this._state = value || <IAppGeneratorState>{currentStep: 0, steps: []};
     this._state.steps = this._state.steps || [];
     this._state.currentStep = this._state.currentStep || 0;
     let steps = [];
     let n: number = 0;
     for (let step of this._state.steps){
       let s = { name: n + 1 , active: this._state.currentStep === n};
       steps.push(s);
       n++;
     }
     this.sequence.steps = steps;
  }
  public get state(): IAppGeneratorState {
    return this._state;
  }

  constructor(
    loggerFactory: LoggerFactory) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, ForgeStepViewComponent.instanceCount++);
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

