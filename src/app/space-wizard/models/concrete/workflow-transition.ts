import { WorkflowAction } from '../contracts/workflow-action';
import { IWorkflowStep } from '../contracts/workflow-step';
import { IWorkflowTransition } from '../contracts/workflow-transition';
import { IWorkflowTransitionContext } from '../contracts/workflow-transition-context';
import { WorkflowTransitionAction } from '../contracts/workflow-transition-action';

/** allows intercepting of workflow transitions  */
export class WorkflowTransition implements IWorkflowTransition {

  from?: IWorkflowStep;
  to?: IWorkflowStep;
  context: IWorkflowTransitionContext;
  canContinue: boolean = false;
  action: WorkflowAction;

  public isTransitioningTo(stepName: string): boolean {
    if ( stepName !== null && stepName !== undefined ) {
      return this.to && this.to.name && this.to.name.trim().toLowerCase() === stepName.trim().toLowerCase();
    }
    return false;
  }

  public isTransitioningFrom(stepName: string): boolean {
    if ( stepName !== null && stepName !== undefined ) {
      return this.from && this.from.name && this.from.name.trim().toLowerCase() === stepName.trim().toLowerCase();
    }
    return false;
  }

  constructor(options: Partial<IWorkflowTransition> = {
      from: null,
      to: null,
      canContinue: true,
      action: WorkflowTransitionAction.GO,
      context: {}
    }) {
    this.context = {};
    this.canContinue = true;
    this.action = WorkflowTransitionAction.GO;
    Object.assign(this, options);
  }

}

