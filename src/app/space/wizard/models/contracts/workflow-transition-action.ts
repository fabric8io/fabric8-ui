import { WorkflowAction } from './workflow-action';
/**
 * Defined options to expose transition direction constants for ease of use
 */
export class WorkflowTransitionAction {
  static GO: WorkflowAction = 'go';
  static PREVIOUS: WorkflowAction = 'previous';
  static NEXT: WorkflowAction = 'next';
}
