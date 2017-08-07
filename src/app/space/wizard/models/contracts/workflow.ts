import { OpaqueToken } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { IWorkflowOptions } from './workflow-options';
import { IWorkflowStep } from './workflow-step';
import { IWorkflowTransition } from './workflow-transition';
import { IWorkflowTransitionContext } from './workflow-transition-context';

//noinspection TsLint
export const IWorkflowToken = new OpaqueToken('IWorkflow');
/**
 * Defines the IWorkflow contract
 */
export interface IWorkflow {
  /** Gets or sets the list of workflow steps */
  steps: Array<Partial<IWorkflowStep>>;
  /** Gets or sets the active step */
  activeStep: IWorkflowStep;
  /** Observable as a way to subscribe to workflow transitions and as well as prevent transitions from occurring
   * or to redirect the next workflow step
   */
  transitions: Observable<IWorkflowTransition>;
  /** Initializes|re-initializes the workflow steps */
  initialize(options: IWorkflowOptions);
  /** Checks if the parametrically specified step is active */
  isStepActive(step: number | string | Partial<IWorkflowStep>): boolean;
  /** parametrically activates the specified step but does not keep track the previous step */
  gotoStep(step: number | string | Partial<IWorkflowStep>, context?: IWorkflowTransitionContext): IWorkflowStep;
  /** activates the default next step, as defined by nextIndex,
   * or as parametrically specified in the optional argument,
   * and records the current step as the previous step
   */
  gotoNextStep(step?: number | string | Partial<IWorkflowStep>): IWorkflowStep;
  /** Activates the previous step but only if there is one to activate */
  gotoPreviousStep(): IWorkflowStep;
  /** Find the step parametrically defined */
  findStep(step: number | string | Partial<IWorkflowStep>): IWorkflowStep;
  /** Retrieves the first step */
  firstStep(): IWorkflowStep;
  /** Workflow cancel handler */
  cancel(options?: any): any;
  /** Workflow finish handler */
  finish(options?: any): any;
  /** Workflow reset handler */
  reset(options?: any): any;
}
