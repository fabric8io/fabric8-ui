import { IWorkflowStep } from './workflow-step';
/**
 * Defines the signature of the delegate that will do a deferred retrieval of the workflow
 */
export interface IWorkflowStepLocator {
  (): IWorkflowStep;
}
