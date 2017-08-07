import { OpaqueToken } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { IForgeCommandRequest, IForgeCommandResponse } from '../../models/forge';

export {
  IForgeCommand,
  IForgeCommandResponse,
  IForgeCommandParameters,
  IForgeCommandData,
  IForgeCommandRequest,
  IForgeCommandPipeline,
  IForgeRequest,
  IForgeResponse,
  IForgeValueChoice,
  IForgeInput,
  IForgeMetadata,
  IForgeState
} from '../../models/forge';

//noinspection TsLint
/**
 * The current list of supported commands
 */
export const ForgeCommands = {
  forgeQuickStart: 'forge-quick-start',
  forgeStarter: 'forge-starter',
  forgeImportGit: 'fabric8-import-git'
};

/**
 * IForgeRequest contract functions as an forge client of sorts.
 * It is responsible for connecting with the forge command REST api
 * and retrieving command results
 */
export interface IForgeService {
  executeCommand(options: IForgeCommandRequest): Observable<IForgeCommandResponse>;
}

/**
 * ForgeService contract using abstract base class.
 */
export abstract class ForgeService implements IForgeService {
  abstract executeCommand(options: IForgeCommandRequest): Observable<IForgeCommandResponse>;
}

//noinspection TsLint
/**
 * service dependency injection token to be used with @Inject annotation.
 * There is some magic string badness here but typescript interface metadata
 * query is limited
 */
export const IForgeServiceToken = new OpaqueToken('IForgeService');

