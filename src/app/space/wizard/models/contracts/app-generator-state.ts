export interface IAppGeneratorState {
  valid: boolean;
  canExecute: boolean;
  /** is this state part of an execute command */
  isExecute: boolean;
  canMoveToNextStep: boolean;
  canMovePreviousStep: boolean;
  steps: Array<String>;
  currentStep: number;
  title: string;
  description: string;
  /** Other dynamic fields */
  [key: string]: any;
}
