import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WorkSpacesService as LauncherWorkSpacesService } from 'ngx-launcher';
import { WorkspaceLinks } from './../../create/codebases/services/workspace';
import { WorkspacesService } from './../../create/codebases/services/workspaces.service';

@Injectable()
export class AppLaunchWorkSpaceService implements LauncherWorkSpacesService {

    constructor(private workSapaceService: WorkspacesService) {}

    /**
   * Create a workspace for given codebase ID
   *
   * @param codeBaseId The ID associated with the given workspace
   * @returns {Observable<WorkspaceLinks>}
   */
    createWorkSpace(codeBaseId: string): Observable<WorkspaceLinks> {
        return this.workSapaceService.createWorkspace(codeBaseId);
    }
}
