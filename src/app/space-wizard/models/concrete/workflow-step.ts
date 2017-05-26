import { IWorkflow } from '../contracts/workflow';
import { IWorkflowLocator } from '../contracts/workflow-locator';
import { IWorkflowStep } from '../contracts/workflow-step';
import { IWorkflowTransitionContext } from '../contracts/workflow-transition-context';
import { WorkflowTransitionAction } from '../contracts/workflow-transition-action';

/** implementation of the IWorkflowStep */
export class WorkflowStep implements IWorkflowStep {

  index: number = 0;
  name: string = '';
  nextIndex: number;

  constructor(options: Partial<IWorkflowStep>, private workflowLocator: IWorkflowLocator) {
    Object.assign(this, options);
  }

  gotoNextStep(step?: number | string | Partial<IWorkflowStep>) {
    return this.workflow.gotoNextStep(step);
  }

  gotoPreviousStep() {
    return null;
  }

  isActive() {
    return this.workflow.isStepActive(this);
  }

  activate() {
    this.workflow.gotoStep(this);
    return this;
  }

  gotoStep(destination: number
      | string
      | IWorkflowStep, context: IWorkflowTransitionContext = { action: WorkflowTransitionAction.GO }) {
    let step: IWorkflowStep = null;
    if ( this.isActive ) {
      // you can only goto a step if 'this' is the active step
      step = this.workflow.gotoStep(destination, context);
    }
    return step;
  }

  getNextStep() {
    return this.workflow.findStep(this.nextIndex);
  }

  get workflow() {
    return this.workflowLocator();
  }

  set workflow(value: IWorkflow) {
    // no op is intentional here
  }

}

