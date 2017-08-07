import { IForgeCommandParameters } from './forge-command-parameters';

export interface IForgeCommand {
  /** The name of the command */
  name: string;
  /** The optional parameters required to execute the command */
  parameters?: IForgeCommandParameters;
}
