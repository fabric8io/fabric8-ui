export interface IForgeState {
  valid: boolean;
  canExecute: boolean;
  isExecute: boolean;
  wizard: boolean;
  canMoveToNextStep?: boolean;
  canMoveToPreviousStep?: boolean;
  steps?: Array<string>;
  [key: string]: any;
}
