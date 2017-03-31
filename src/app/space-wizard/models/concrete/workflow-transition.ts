import { WorkflowDirection } from '../contracts/workflow-direction';
import { IWorkflowStep } from '../contracts/workflow-step';
import { IWorkflowTransition } from '../contracts/workflow-transition';
import { IWorkflowTransitionContext } from '../contracts/workflow-transition-context';
import { WorkflowTransitionDirection } from '../contracts/workflow-transition-direction';

/** allows intercepting of workflow transitions  */
export class WorkflowTransition implements IWorkflowTransition {

  from?: IWorkflowStep;
  to?: IWorkflowStep;
  context: IWorkflowTransitionContext;
  canContinue: boolean = false;
  direction: WorkflowDirection;

  constructor(options: Partial<IWorkflowTransition> = {
                from       : null,
                to         : null,
                canContinue: true,
                direction  : WorkflowTransitionDirection.GO,
                context    : {}
              }) {
    this.context     = {};
    this.canContinue = true;
    this.direction   = WorkflowTransitionDirection.GO;
    Object.assign(this, options);
  }

}

