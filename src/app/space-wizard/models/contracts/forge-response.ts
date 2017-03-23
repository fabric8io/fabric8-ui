import { IForgePayload} from './forge-payload';

export interface IForgeResponse {
  payload?: IForgePayload ;
  /** for out of band data */
  context?:any
}

