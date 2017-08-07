import { IAppGeneratorCommandParameters } from './app-generator-command-parameters';
export interface IAppGeneratorCommand {
  /** Application command name */
  name: string;
  /** Any command parameters supplied  */
  parameters?: IAppGeneratorCommandParameters;
  /** Other dynamic properties */
  [propertyName: string]: any;
}



