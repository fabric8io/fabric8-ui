import { IWorkflowStep } from '../contracts/workflow-step';
import { IWorkflowTransition } from '../contracts/workflow-transition';
import { IWorkflowTransitionContext } from '../contracts/workflow-transition-context';
import { WorkflowTransitionDirection } from '../contracts/workflow-transition-direction';
import { WorkflowDirection } from '../contracts/workflow-direction';


/** allows intercepting of workflow transitions  */
export class WorkflowTransition implements IWorkflowTransition {
  constructor(options: Partial<IWorkflowTransition> = { from: null, to: null, continue: true, direction: WorkflowTransitionDirection.GO, context: {} }) {
    this.context = {};
    this.continue = true;
    this.direction = WorkflowTransitionDirection.GO;
    Object.assign(this, options);
  }
  from?: IWorkflowStep;
  to?: IWorkflowStep;
  context: IWorkflowTransitionContext
  continue: boolean = false;
  direction: WorkflowDirection;
}
