import { IAppGeneratorCommand } from './app-generator-command';

export interface IAppGeneratorRequest {
  /** The application command information to be executed  */
  command: IAppGeneratorCommand ;
  /** Other dynamic fields */
  [key: string]: any;
}
