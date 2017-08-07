import { IAppGeneratorCommand } from './app-generator-command';

export interface IAppGeneratorResponseContext {
  /** The command used to generated the current response */
  currentCommand: IAppGeneratorCommand;
  /** The next command to be executed */
  nextCommand: IAppGeneratorCommand;
  /** The next validation command to be executed */
  validationCommand: IAppGeneratorCommand;
  /** The execute command to be executed */
  executeCommand: IAppGeneratorCommand;
  /** Other dynamic fields */
  [key: string]: any;
}
