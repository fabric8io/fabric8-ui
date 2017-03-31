import { IWorkflow } from './workflow';
/**
 * Defines the signature of the delegate that will do a deferred retrieval of the workflow
 */
export interface IWorkflowLocator {
  (): IWorkflow;
}
