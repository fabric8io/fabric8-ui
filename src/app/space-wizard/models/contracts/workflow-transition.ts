import { WorkflowAction } from './workflow-action';
import { IWorkflowStep } from './workflow-step';
import { IWorkflowTransitionContext } from './workflow-transition-context';
/**
 * When workflow's transition from one step to the next, it is possible to subscribe to these transitions.
 * This contract defines the shape of that transition
 */
export interface IWorkflowTransition {
  /** The workflow step that is being transitioned from */
  readonly from?: IWorkflowStep;
  /** The workflow step that is being transitioned to */
  to?: IWorkflowStep;
  /** Boolean indicating if the transition should continue or not */
  canContinue: boolean;
  /** Misc contextual information */
  context?: IWorkflowTransitionContext;
  /** The workflow action that caused the transition */
  action: WorkflowAction;
  /** Given the step name returns if the name is the transition target  */
  isTransitioningTo(stepName: string): boolean;
  /** Given the step name returns if the name is the transition source  */
  isTransitioningFrom(stepName: string): boolean;
}
