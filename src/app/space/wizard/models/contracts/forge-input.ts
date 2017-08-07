import { IForgeValueChoice } from './forge-value-choice';

export interface IForgeInput {
  name: string;
  label: string;
  description?: string;
  note?: string;
  'class': string;
  value: any; // string|Array<string>;
  valueType?: string;
  valueChoices?: Array<IForgeValueChoice>;
  enabled: boolean;
  required: boolean;
  deprecated: boolean;
  version?: string;
  // other dynamic properties
  [key: string]: any;
}
