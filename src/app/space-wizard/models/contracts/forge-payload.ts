import { IForgeInput } from './forge-input';
import { IForgeState } from './forge-state';
import { IForgeMetadata } from './forge-metadata';
import { IForgeMessage } from './forge-message';


export interface IForgeCommandPayload {
  metadata?:IForgeMetadata;
  state?:IForgeState;
  messages?: Array<IForgeMessage>;
  inputs: Array<IForgeInput>;
  [key: string]: any;
}
