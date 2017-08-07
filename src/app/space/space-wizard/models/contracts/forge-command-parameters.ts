import { IForgeCommandData } from './forge-command-data';
import { IForgeCommandPipeline } from './forge-command-pipeline';

export interface IForgeCommandParameters {
  data?: IForgeCommandData;
  pipeline?: IForgeCommandPipeline;
  validatedData?: IForgeCommandData;
  // Other dynamic fields
  [propertyName: string]: any;
}
