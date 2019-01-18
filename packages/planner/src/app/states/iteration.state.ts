import { IterationUI } from './../models/iteration.model';

export type IterationState = {
  [iterationId: string]: IterationUI;
};

export const initialState: IterationState = {} as IterationState;

export interface IterationUIState {
  modalLoading: boolean;
  error: string;
  success: string;
}

export const initialUIState: IterationUIState = {
  modalLoading: false,
  error: '',
  success: '',
};
