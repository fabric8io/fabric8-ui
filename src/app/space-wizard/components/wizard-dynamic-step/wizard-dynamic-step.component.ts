import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges, SimpleChange, Input, Output, Inject, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { IWorkflowStep, IWorkflowTransition, IWorkflow, WorkflowTransitionDirection } from '../../models/workflow';
import { LoggerFactory, ILoggerDelegate } from '../../common/logger';
import { INotifyPropertyChanged } from '../../core/component'

import { IFieldInfo, IFieldSet, IAppGeneratorResponse, IAppGeneratorRequest, IAppGeneratorCommand, IAppGeneratorService, IAppGeneratorServiceProvider } from '../../services/app-generator.service';


import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

@Component({
  host: {
    'class': 'wizard-step'
  },
  selector: 'wizard-dynamic-step',
  templateUrl: './wizard-dynamic-step.component.html',
  styleUrls: ['./wizard-dynamic-step.component.scss'],
  providers: [IAppGeneratorServiceProvider.FactoryProvider]
})
export class WizardDynamicStepComponent implements OnInit, OnDestroy, OnChanges {

  // keep track of the number of instances
  static instanceCount: number = 1;
  /** logger delegate delegates logging to a logger */
  private log: ILoggerDelegate = () => { };

  private _workflow: IWorkflow
  @Input()
  get workflow(): IWorkflow {
    return this._workflow
  }
  set workflow(value: IWorkflow) {
    this._workflow = value;
  }

  multiSelectSettings: IMultiSelectSettings = {
    pullRight: false,
    enableSearch: true,
    checkedStyle: 'checkboxes',
    buttonClasses: 'btn btn-default',
    selectionLimit: 0,
    closeOnSelect: false,
    showCheckAll: true,
    showUncheckAll: true,
    dynamicTitleMaxItems: 1,
    maxHeight: '200px',
  };

  multiSelectTexts: IMultiSelectTexts = {
    checkAll: 'Check all',
    uncheckAll: 'Uncheck all',
    checked: 'checked',
    checkedPlural: 'checked',
    searchPlaceholder: 'Search...',
    defaultTitle: 'Select',
  };



  @Input() stepName: string = "";
  @Input() commandName: string = "";

  constructor(
    @Inject(IAppGeneratorServiceProvider.InjectToken) private _appGeneratorService: IAppGeneratorService,
    loggerFactory: LoggerFactory
  ) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, WizardDynamicStepComponent.instanceCount++);
    if (logger) {
      this.log = logger;
    }
    this.log(`New instance ...`);

  }

  /** All inputs are bound and values assigned, but the 'workflow' get a new instance every time the parents host dialog is opened */
  ngOnInit() {
    this.log(`ngOnInit ...`)
  }

  ngOnDestroy() {
    this.log(`ngOnDestory ...`)
  }
  /** handle all changes to @Input properties */
  ngOnChanges(changes: SimpleChanges) {
    this.log(`ngOnChanges ...`)
    for (let propName in changes) {
      switch (propName.toLowerCase()) {
        case "workflow":
          {
            let change: INotifyPropertyChanged<IWorkflow> = <any>changes[propName];
            this.onWorkflowPropertyChanged(change);
            break;
          }
      }
    }
  }

  private onWorkflowPropertyChanged(change?: INotifyPropertyChanged<IWorkflow>) {
    if (change) {
      if (change.currentValue !== change.previousValue) {
        this.log(`The workflow property changed value ...`);
        let prev: IWorkflow = change.previousValue;
        let current: IWorkflow = change.currentValue;
        this.subscribeToWorkflowTransitions(current);
      }
    }
  }

  private isTransitioningToThisStep(transition: IWorkflowTransition): boolean {
    return transition.to && transition.to.name.toLowerCase() === this.stepName.toLowerCase()
  }
  private isTransitioningFromThisStep(transition: IWorkflowTransition): boolean {
    return transition.from && transition.from.name.toLowerCase() === this.stepName.toLowerCase()
  }

  private _fieldSet: IFieldSet;
  get fieldSet(): IFieldSet {
    this._fieldSet = this._fieldSet || [];
    return this._fieldSet;
  }
  set fieldSet(value: IFieldSet) {
    this._fieldSet = value;
  }

  // response history assists with tracking response state between workflow steps
  private _responseHistory: Array<IAppGeneratorResponse>;
  private get responseHistory(): Array<IAppGeneratorResponse> {
    this._responseHistory = this._responseHistory || [];
    return this._responseHistory;
  }
  private set responseHistory(value: Array<IAppGeneratorResponse>) {
    this._responseHistory = value;
  }
  private currentResponse: IAppGeneratorResponse;


  private subscribeToWorkflowTransitions(workflow: IWorkflow) {
    if (!workflow) {
      return;
    }
    this.log(`Subscribing to workflow transitions ...`);
    workflow.transitions.subscribe((transition) => {
      try {
        this.log({ message: `Subscriber responding to an observed '${transition.direction}' workflow transition: from ${transition.from ? transition.from.name : "null"} to ${transition.to ? transition.to.name : "null"}.` });
        //entering this step
        if (this.isTransitioningToThisStep(transition)) {
          switch (transition.direction) {
            case WorkflowTransitionDirection.NEXT:
              {
                if (transition.from != transition.to) {
                  let request: IAppGeneratorRequest = {
                    command: {
                      name: `${this.commandName}`,
                      parameters: {
                        inputs: null,
                        data: null,
                        workflow: {
                          step: {
                            name: "begin"
                          }
                        }
                      }
                    }
                  };
                  this.log("command being sent to the app generator service:");
                  this._appGeneratorService.getFieldSet(request).subscribe((response) => {

                    //let fieldSet=response.payload;
                    //let prevFieldSet = this.fieldSet;
                    if (this.responseHistory.length > 0) {
                      let prevResponse = this.currentResponse;
                      this.responseHistory.push(prevResponse);
                      //this.responseHistory.push(prevFieldSet);
                      this.log(`Stored fieldset[${prevResponse.payload.length}] into fieldset history ... there are ${this.responseHistory.length} items in history ...`);
                    }
                    this.currentResponse = response;
                    this.fieldSet = response.payload;
                  })
                }
                break;
              }
            case WorkflowTransitionDirection.PREVIOUS:
              {
                if (transition.from === transition.to) {
                  //let fieldSet = this.responseHistory.pop();
                  let response = this.responseHistory.pop();
                  this.fieldSet = response.payload;
                  //this.fieldSet = fieldSet;
                  this.log(`Restored fieldset[${response.payload.length}] from fieldset history ... there are ${this.responseHistory.length} items in history ...`);
                }
                break;
              }
          }
        }
        //leaving the step
        if (this.isTransitioningFromThisStep(transition)) {
          switch (transition.direction) {
            case WorkflowTransitionDirection.NEXT:
              {
                if (transition.from != transition.to) {
                  //keep at this point
                  transition.to = transition.from;
                  let prevResponse = this.currentResponse;
                  this.responseHistory.push(prevResponse);
                  this.log(`stored fieldset[${prevResponse.payload.length}] into history ... there are ${this.responseHistory.length} items in history ...`);
                  let command = this.currentResponse.context.nextCommand;
                  command.parameters.inputs = this.fieldSet;
                  this.log("command being sent to the app generator service:");
                  console.dir(command);
                  let request: IAppGeneratorRequest = {
                    command: command
                  };
                  this._appGeneratorService.getFieldSet(request).subscribe((response) => {
                    this.currentResponse = response;
                    this.fieldSet = response.payload;
                  })
                }
                // transition.continue = false to prevent transitions;
                break;
              }
          }
        }
      }
      catch (err) {
        this.log({ message: err.message, error: true, inner: err });
      }
    })
  }
};
