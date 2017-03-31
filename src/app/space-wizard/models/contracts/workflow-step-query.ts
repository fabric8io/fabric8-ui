import { IWorkflowStep } from './workflow-step';
/**
 * Defines the signature of the delegate that will do a deferred retrieval a workflow step query.
 * The return type of the delegate is a partial workflowstep OR string (name) OR number (index)
 */
export interface IWorkflowStepQuery {
  (): Partial<IWorkflowStep> | number | string;
}
