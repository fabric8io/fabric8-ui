import { IFieldSet } from './field-set';

export interface IAppGeneratorResponse {
  payload: IFieldSet;
  context?: any;
  /** other dynamic fields */
  [key: string]: any;
}

