import { ViewEncapsulation, Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
//
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import { INotifyPropertyChanged } from '../../core/component';

import { IWorkflow, IWorkflowTransition, WorkflowTransitionAction } from '../../models/workflow';

import {
  IField,
  IFieldChoice
} from '../../services/app-generator.service';

import { ForgeAppGeneratorServiceClient } from './forge-app-generator-service-client';
import { FieldWidgetClassificationOptions } from '../../models/contracts/field-classification';

@Component({
  host: {
   'class': 'wizard-step'
  },
  // ensure that dynamically added html message get styles applied
  encapsulation: ViewEncapsulation.None,

  selector: 'forge-app-generator',
  templateUrl: './forge-app-generator.component.html',
  styleUrls: [ './forge-app-generator.component.scss' ],
  providers: [
    ForgeAppGeneratorServiceClient.factoryProvider
  ]
})
export class ForgeAppGeneratorComponent implements OnInit, OnDestroy, OnChanges {

  // keep track of the number of instances
  static instanceCount: number = 1;

  @Input() title: string = 'Forge Command Wizard';
  @Input() workflowStepName: string = '';
  @Input() forgeCommandName: string = 'none';

  private _workflow: IWorkflow;

  constructor(
    public forgeClient: ForgeAppGeneratorServiceClient,
    loggerFactory: LoggerFactory) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, ForgeAppGeneratorComponent.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.log(`New instance ...`);
  }

  @Input()
  get workflow(): IWorkflow {
    return this._workflow;
  }

  set workflow(value: IWorkflow) {
    this._workflow = value;
  }

  /**
   * All inputs are bound and values assigned, but the 'workflow' get a new instance every time the parents host dialog
   * is opened.
   */
  ngOnInit() {
    this.log(`ngOnInit ...`);
    this.forgeClient.commandName = this.forgeCommandName;
    this.forgeClient.workflow = this.workflow;
  }

  ngOnDestroy() {
    this.log(`ngOnDestroy ...`);
  }

  /** handle all changes to @Input properties */
  ngOnChanges(changes: SimpleChanges) {
    for ( let propName in changes ) {
      if ( changes.hasOwnProperty(propName) ) {
        this.log(`ngOnChanges ... ${propName}`);
        switch ( propName.toLowerCase() ) {
          case 'workflow': {
            let change: INotifyPropertyChanged<IWorkflow> = <any>changes[ propName ];
            this.onWorkflowPropertyChanged(change);
            break;
          }
          default : {
            break;
          }
        }
      }
    }
  }

  allOptionsSelected(field: IField): boolean {
    return !field.display.choices.find((i) => i.selected === false);
  }

  selectOption(field: IField, choice: IFieldChoice) {
    choice.selected = true;
    this.updateFieldValue(field);
  }
  toggleOption(field: IField, choice: IFieldChoice) {
    choice.selected = !choice.selected;
    this.updateFieldValue(field);
  }

  deselectOption(field: IField, choice: IFieldChoice) {
    choice.selected = false;
    this.updateFieldValue(field);
  }

  updateFieldValue(field: IField): IField {
    if ( !field ) {
      return null;
    }
    switch (field.display.inputType) {
      case FieldWidgetClassificationOptions.MultipleSelection:
      {
        if ( field.display.hasChoices ) {
          field.value = field.display.choices
          .filter((o) => o.selected)
          .map((o) => o.id);
        } else {
          field.value = [];
        }
        this.forgeClient.validate();
        break;
      }
      default: {
        break;
      }
    }
    return field;
  }

  deselectAllOptions(field: IField) {
    field.display.choices.forEach((o) => {
      o.selected = false;
    });
  }

  filterList(field: IField, filter: string) {
    // TODO: better validation of bad chars
    filter = filter.replace('*', '');
    filter = filter.replace('?', '');
    filter = filter.replace('/', '');
    filter = filter.replace('\\', '');
    let r = new RegExp(filter || '', 'ig');
    field.display.choices.filter((o) => {
      // set everything to not visible, except for selected
      o.visible = false;
      if (o.selected === true) {
        o.visible = true;
      }
      // then match the input string
      return ((o.id.match(r)) || []).length > 0;
    })
    .forEach(o => {
      o.visible = true;
    });

  }

  selectAllOptions(field: IField) {
    field.display.choices.forEach((o) => {
      o.selected = true;
    });
  }

  toggleSelectAll(field: IField) {
    if ( !field ) {
      return;
    }
    // at least one not selected, then select all , else deselect all
    let item = field.display.choices.find((i) => i.selected === false);
    if ( item ) {
      for ( let o of field.display.choices ) {
        o.selected = true;
      }
    } else {
      for ( let o of field.display.choices ) {
        o.selected = false;
      }
    }
    this.updateFieldValue(field);
  }

  trackByFn(index: any, item: any) {
   return index;
  }

  private onWorkflowPropertyChanged(change?: INotifyPropertyChanged<IWorkflow>) {
    if ( change ) {
      if ( change.currentValue !== change.previousValue ) {
        this.log(`
          The workflow property changed value ...`);
        let current: IWorkflow = change.currentValue;
        this.forgeClient.workflow = current;
        this.subscribeToIncomingWorkflowTransitions(current);
        this.subscribeToOutgoingWorkflowTransitions(current);
      }
    }
  }
  private subscribeToOutgoingWorkflowTransitions(workflow: IWorkflow) {
    if ( !workflow ) {
      return;
    }
    workflow.transitions.filter(transition => transition.isTransitioningFrom(this.workflowStepName))
    .subscribe((transition) => {
      switch ( transition.action ) {
        case WorkflowTransitionAction.NEXT: {
          // moving from this point in the workflow as the result of a nextStep transition
          break;
        }
        case WorkflowTransitionAction.GO: {
          // moving from this point in the workflow as the result of a goToStep transition
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  private subscribeToIncomingWorkflowTransitions(workflow: IWorkflow) {
    if ( !workflow ) {
      return;
    }
    workflow.transitions.filter(transition => transition.isTransitioningTo(this.workflowStepName))
    .subscribe((transition) => {
      this.forgeClient.begin();
    });
  }

  /** logger delegate delegates logging to a logger */
  private log: ILoggerDelegate = () => {};

}

