import { IWorkflowStep } from './workflow-step';
import { IWorkflowTransitionContext } from './workflow-transition-context';
import { WorkflowDirection } from './workflow-direction';
/**
 * When workflows transition from one step to the next, it is possible to subscribe to these transitions.
 * This contract defines the shape of that transition
 */
export interface IWorkflowTransition {
  /** The workflow step that is being transitioned from */
  readonly from?: IWorkflowStep;
  /** The workflow step that is being transitioned to */
  to?: IWorkflowStep;
  /** Boolean indicating if the transition should continue or not */
  continue: boolean;
  /** Misc contextual information */
  context?: IWorkflowTransitionContext;
  /** The workflow direction in which the transition is being made */
  direction: WorkflowDirection;
}
