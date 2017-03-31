import { IForgeInput } from './forge-input';
import { IForgeMessage } from './forge-message';
import { IForgeMetadata } from './forge-metadata';
import { IForgeState } from './forge-state';

export interface IForgeCommandPayload {
  metadata?: IForgeMetadata;
  state?: IForgeState;
  messages?: Array<IForgeMessage>;
  inputs: Array<IForgeInput>;
  [key: string]: any;
}
