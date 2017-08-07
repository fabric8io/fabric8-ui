import { IForgeCommandData } from './forge-command-data';
export interface IForgeCommandResponsePayload {
  /** The data returned from the forge http endpoint */
  data: IForgeCommandData;
}
