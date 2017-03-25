import { IWorkflowStep } from '../contracts/workflow-step';
import { IWorkflowLocator } from '../contracts/workflow-locator';
import { IWorkflowTransitionContext } from '../contracts/workflow-transition-context';
import { WorkflowTransitionDirection } from '../contracts/workflow-transition-direction';
import { IWorkflow } from '../contracts/workflow';

/** implementation of the IWorkflowstep */
export class WorkflowStep implements IWorkflowStep {


  index: number = 0;
  name: string = "";
  nextIndex: number;

  constructor(options: Partial<IWorkflowStep>, private workflowLocator: IWorkflowLocator) {
    Object.assign(this, options);
  }

  gotoNextStep(step?: number | string | Partial<IWorkflowStep>) {
    return this.workflowLocator().gotoNextStep(step);
  }

  gotoPreviousStep() {
    return null;
  }

  isActive() {
    return this.workflowLocator().isStepActive(this);
  }

  activate() {
    this.workflowLocator().gotoStep(this);
    return this;
  }

  gotoStep(destination: number | string | IWorkflowStep, context: IWorkflowTransitionContext = { direction: WorkflowTransitionDirection.GO }) {
    let step: IWorkflowStep = null;
    if (this.isActive) {
      //you can only goto a step if 'this' is the active step
      step = this.workflowLocator().gotoStep(destination, context);
    }
    return step;
  }

  getNextStep() {
    let step = this.workflowLocator().findStep(this.nextIndex);
    return step;
  }

  get workflow() {
    return this.workflowLocator();
  }

  set workflow(value: IWorkflow) {
  }

};
