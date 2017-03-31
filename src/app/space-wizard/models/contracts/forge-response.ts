import { IForgeCommandPayload } from './forge-payload';

export interface IForgeResponse {
  payload?: IForgeCommandPayload | any ;
  /** for any other out of band data */
  context?: any;
}

