import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs/Rx';
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import { IWorkflow } from '../contracts/workflow';
import { IWorkflowOptions } from '../contracts/workflow-options';

import { IWorkflowStep } from '../contracts/workflow-step';
import { IWorkflowTransition } from '../contracts/workflow-transition';
import { WorkflowTransitionAction } from '../contracts/workflow-transition-action';

import { WorkflowStep } from './workflow-step';
import { WorkflowTransition } from './workflow-transition';

/** Implementation of the workflow contract */
@Injectable()
export class Workflow implements IWorkflow {

  static instanceCount: number = 1;

  private _steps: Array<IWorkflowStep> = [];
  private _workflowTransitionSubject: Subject<IWorkflowTransition>;
  private _activeStep: IWorkflowStep;

  constructor(loggerFactory: LoggerFactory) {

    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, Workflow.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }

    this.log(`New instance ...`);
  }

  get steps(): Array<IWorkflowStep> {
    return this._steps;
  }

  set steps(value: Array<IWorkflowStep>) {
    this.initialize({ steps: () => value });
  }

  /** default cancel handler */
  cancel(options?: any): any {
    return null;
  }

  /** default finish handler */
  finish(options?: any): any {
    return null;
  }

  /** default reset handler */
  reset(options?: any): any {
    return null;
  }

  firstStep(): IWorkflowStep {
    // The default first step handler is null ... it gets overridden during initialization.
    return null;
  }

  get activeStep(): IWorkflowStep {
    return this._activeStep;
  }

  set activeStep(value: IWorkflowStep) {
    this.log(`Setting the active workflow step from
                '${this._activeStep ? this._activeStep.name : 'null'}' to '${value ? value.name : 'null'}' `);
    this._activeStep = value;
  }

  initialize(options: IWorkflowOptions) {
    this.log('Initializing the workflow ...');
    let workflow = this;
    this._steps = [];
    // ensure callback have correct 'this'
    let items = options.steps.apply(workflow) || [];
    // first sort by index
    items = items.sort((i) => {
      return i.index;
    });
    // retrieve the default first item, i.e the one with the lowest index.
    let firstIndex: number = 0;
    if ( items.length > 0 ) {
      firstIndex = items[ 0 ].index;
    }
    // then insert items
    for ( let item of items ) {
      if ( item.index && item.index < firstIndex ) {
        firstIndex = item.index;
      }
      let step = new WorkflowStep(item, () => workflow);
      this._steps.push(step);
    }
    // Set up the 'first step' handler/closure that will dynamically use index or
    // the  IWorkflowStepQuery optionally passed in with workflow options;
    this.firstStep = () => {
      if ( !options.firstStep ) {
        options.firstStep = () => firstIndex;
      }
      let first = options.firstStep();
      let firstStep = workflow.findStep(first);
      if ( !firstStep ) {
        firstStep = workflow.findStep(firstIndex);
      }
      return firstStep;
    };
    // now set active step to firstStep
    this.activeStep = this.firstStep();
    if ( options.cancel ) {
      this.cancel = (... args) => {
        let timer = setTimeout(() => {
          clearTimeout(timer);
          this.log('Invoking cancel ... ');
          options.cancel.apply(workflow, args);
        }, 10);
      };
    }
    if ( options.finish ) {
      this.finish = (... args) => {
        let timer = setTimeout(() => {
          clearTimeout(timer);
          this.log('Invoking finish ... ');
          options.finish.apply(workflow, args);
        }, 10);
      };
    }
  }

  isStepActive(step: number | string | Partial<IWorkflowStep>) {
    if ( this.activeStep ) {
      if ( step === this.findStep ) {
        // check for reference
        return true;
      }
      if ( typeof step === 'number' ) {
        // check by number
        return step === this.activeStep.index;
      } else if ( typeof step === 'string' ) {
        // check by name
        return step.toLowerCase() === this.activeStep.name.toLowerCase();
      } else {
        // check by partial
        if ( step.index !== null && step.index !== undefined ) {
          // check by partial.number
          return step === this.activeStep.index;
        } else if ( step.name ) {
          // check by partial.name
          return step.name.toLowerCase() === this.activeStep.name.toLowerCase();
        }
      }
    }
    return false;
  }

  findStep(destination: number | string | Partial<IWorkflowStep>) {
    let step: IWorkflowStep = null;
    if ( typeof destination === 'number' ) {
      step = this.steps.find((s) => s.index === destination);
      return step;
    } else if ( typeof destination === 'string' ) {
      step = this.steps.find((s) => s.name.toLowerCase() === destination.toLowerCase());
      return step;
    } else {
      if ( destination.index !== null && destination.index !== undefined ) {
        step = this.steps.find((s) => s.index === destination.index);
        return step;
      } else if ( destination.name ) {
        step = this.steps.find((s) => s.name.toLowerCase() === destination.name.toLowerCase());
      }
    }
    return step;
  }

  // TODO: convert to promise for async long running transitions
  gotoStep(destination: number
      | string
      | Partial<IWorkflowStep>, transitionOptions: Partial<IWorkflowTransition> = {
      canContinue: true,
      action: WorkflowTransitionAction.GO,
      context: {}
    }) {

    let destinationStep = this.findStep(destination);
    if ( destinationStep ) {
      transitionOptions.canContinue = transitionOptions.canContinue || true;
      transitionOptions.action = transitionOptions.action || WorkflowTransitionAction.GO;
      transitionOptions.context = transitionOptions.context || {};
      let transition = this.workflowTransitionShouldContinue({
                                                               from: this.activeStep,
                                                               to: destinationStep,
                                                               action: transitionOptions.action,
                                                               canContinue: transitionOptions.canContinue,
                                                               context: transitionOptions.context
                                                             });
      if ( transition.canContinue === true ) {
        // originally transition.to was the destination ... but if changed then add new previous step closures to
        // preserve previous step order
        if ( transition.to && destinationStep !== transition.to ) {
          let newDestinationStep = transition.to;
          this.log(`transition:
                      destination step = '${destinationStep.name}' modified to be '${newDestinationStep.name}'`);
          // modify prev step handler if target step changed
          let priorHandler = newDestinationStep.gotoPreviousStep;
          // by dynamically adding the gotoNextStep function using a closure to retrieve previous step
          newDestinationStep.gotoPreviousStep = () => {
            let step = this.gotoStep(transition.from, {
              canContinue: true,
              action: WorkflowTransitionAction.PREVIOUS
            });
            // restore prior handler
            newDestinationStep.gotoPreviousStep = priorHandler;
            return step;
          };
          destinationStep = transition.to;
        }
        this.activeStep = transition.to;
      }
    }
    return destinationStep;
  }

  gotoNextStep(destination?: number | string | Partial<IWorkflowStep>) {
    this.log(`gotoNextStep ...`);
    let nextStep: IWorkflowStep = null;
    let activeStep = this.activeStep;
    if ( !destination ) {
      // if nothing specified (i.e no branching) then just do the default behavior based on nextIndex
      if ( activeStep ) {
        nextStep = this.findStep(activeStep.nextIndex);
        this.log(`Found next step = ${nextStep.name} ...`);
      } else {
        // if no active step then the firstStep is the next step
        this.activeStep = this.firstStep();
        this.log(`Found next step = ${this.activeStep.name} ...`);
        return this.activeStep;
      }
    } else {
      // otherwise 'branch' to specified step
      nextStep = this.findStep(destination);
      this.log(`Found next step = ${nextStep.name} ...`);
    }
    if ( !nextStep ) {
      let currentStep = '';
      if ( this.activeStep ) {
        currentStep = ` for ${this.activeStep.name}`;
      }
      this.log(`gotoNextStep ... no next step for the current step = ${currentStep} ...`);
    }
    // setup the previous step handler and transition to next step if the step is valid
    if ( nextStep ) {
      let priorHandler = nextStep.gotoPreviousStep;
      // by dynamically adding the gotoNextStep function using a closure to retrieve previous step
      nextStep.gotoPreviousStep = () => {
        let step = this.gotoStep(activeStep, {
          canContinue: true,
          action: WorkflowTransitionAction.PREVIOUS
        });
        // restore prior handler
        nextStep.gotoPreviousStep = priorHandler;
        return step;
      };
      this.gotoStep(nextStep.index, { canContinue: true, action: WorkflowTransitionAction.NEXT, context: {} });
    }
    return nextStep;
  }

  gotoPreviousStep() {
    this.log(`gotoPreviousStep ...`);
    let previousStep = null;
    let currentActiveStep = this.activeStep;
    if ( currentActiveStep.gotoPreviousStep ) {
      previousStep = currentActiveStep.gotoPreviousStep();
    }
    return previousStep;
  }

  get workflowTransitionSubject(): Subject<IWorkflowTransition> {
    this._workflowTransitionSubject = this._workflowTransitionSubject || new Subject<IWorkflowTransition>();
    return this._workflowTransitionSubject;
  }

  set workflowTransitionSubject(value: Subject<IWorkflowTransition>) {
    this._workflowTransitionSubject = value;
  }

  // Note: every subscriber gets an observable instance
  get transitions(): Observable<IWorkflowTransition> {
    let me = this;
    return Observable.create((observer: Observer<IWorkflowTransition>) => {
      me.workflowTransitionSubject.subscribe(observer);
      this.log('A new subscriber to workflow transitions has been added ...');

    });
  }

  // TODO needs to return a promise to cater for async step continuation
  private workflowTransitionShouldContinue(options: Partial<IWorkflowTransition> = {
      canContinue: false,
      context: {
        action: WorkflowTransitionAction.GO
      }
    }): IWorkflowTransition {
    let transition = new WorkflowTransition(options);
    this.log(`Notify workflow transition subscribers of an upcoming '${transition.action}' transition
                from '${transition.from ? transition.from.name : 'null'}'
                to '${transition.to ? transition.to.name : 'null'}' `);
    this.workflowTransitionSubject.next(transition);
    this.log(`workflowTransitionShouldContinue = ${transition.canContinue}`);
    if ( transition.canContinue === false ) {
      this.log({
                 message: `Note: workflow will not proceed from '${transition.from ? transition.from.name : 'null'}'
                             to '${transition.to ? transition.to.name : 'null'}'
                             because transition.canContinue=${transition.canContinue}`,
                 warning: true
               });

    }
    return transition;
  }

  private log: ILoggerDelegate = () => {};

}

