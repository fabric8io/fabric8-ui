import {IAppGeneratorCommand} from './app-generator-command';

export interface IAppGeneratorRequest {
  command: IAppGeneratorCommand|any;
  /** other dynamic fields */
  [key: string]: any;
}
