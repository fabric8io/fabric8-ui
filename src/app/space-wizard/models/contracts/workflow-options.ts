import { IWorkflowStep } from './workflow-step';
import { IWorkflowStepQuery } from './workflow-step-query';
import { IWorkflowCallback } from './workflow-callback';
/**
 * Defines the shape of the options used to initialize a workflow
 * */
export interface IWorkflowOptions {
  /** The steps that will be initialized */
  steps(): Array<Partial<IWorkflowStep>>;
  /** The delegate that returns a workflow step query */
  firstStep?: IWorkflowStepQuery;
  /** The generic callback to call on workflow cancel  */
  cancel?: IWorkflowCallback;
  /** The generic callback to call on workflow finish  */
  finish?: IWorkflowCallback;
}
