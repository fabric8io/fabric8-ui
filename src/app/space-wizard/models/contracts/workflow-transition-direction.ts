import { WorkflowDirection } from './workflow-direction';
/**
 * Defined options to expose transition direction constants for ease of use
 * */
export class WorkflowTransitionDirection {
  static GO: WorkflowDirection = "go";
  static PREVIOUS: WorkflowDirection = "previous";
  static NEXT: WorkflowDirection = "next";
}
