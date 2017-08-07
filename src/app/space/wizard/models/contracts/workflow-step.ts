import { IWorkflow } from './workflow';
import { IWorkflowTransitionContext } from './workflow-transition-context';

/**
 * Defines the IWorkflowStep contract
 */
export interface IWorkflowStep {
  /** The name of the step */
  name: string;
  /** Ihe positional index of the step */
  index: number;
  /** Ihe positional index of the next step */
  nextIndex: number;
  /** The owning workflow */
  workflow: IWorkflow;
  /** Checks if this step is active or not. */
  isActive(): boolean;
  /** Activates this step if it is in the workflow steps collection. */
  activate(): IWorkflowStep;
  /** Activates the parametrically specified step, and DOES NOT record the current step as the previous step. */
  gotoStep(step: number | string | Partial<IWorkflowStep>, context?: IWorkflowTransitionContext): IWorkflowStep;
  /** Activates the default next step, as defined by nextIndex,
   * or as parametrically specified in the optional argument,
   * It DOES record the current step as the previous step (in contrast to gotoStep which DOES NOT)
   */
  gotoNextStep(step?: number | string | Partial<IWorkflowStep>): IWorkflowStep;
  /** Activates the previous step but only if there is a previous step to activate */
  gotoPreviousStep(): IWorkflowStep;
  /** Retrieves the next step if it is in the steps collection but does not activate it. */
  getNextStep(): IWorkflowStep;
}
