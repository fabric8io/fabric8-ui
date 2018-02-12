import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Observable } from 'rxjs';

import { Codebase } from './codebase';
import { Workspace, WorkspaceLinks } from './workspace';

@Injectable()
export class WorkspacesService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private workspacesUrl: string;

  constructor(
      private http: Http,
      private logger: Logger,
      private auth: AuthenticationService,
      private userService: UserService,
      @Inject(WIT_API_URL) apiUrl: string) {
    if (this.auth.getToken() != undefined) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.workspacesUrl = apiUrl + 'codebases';
  }

  /**
   * Create a workspace for given codebase ID
   *
   * @param codebaseId The ID associated with the given workspace
   * @returns {Observable<Codebase>}
   */
  createWorkspace(codebaseId: string): Observable<WorkspaceLinks> {
    let url = `${this.workspacesUrl}/${codebaseId}/create`;
    return this.http
      .post(url, null, { headers: this.headers })
      .retry(8) // che-starter timeout is 3 min -- 30 sec default request timeout is not enough
      .map(response => {
        return response.json() as WorkspaceLinks;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Get workspaces for given codebase ID
   *
   * @param codebaseId The ID associated with the given codebase
   * @returns {Observable<Codebase>}
   */
  getWorkspaces(codebaseId: string): Observable<Workspace[]> {
    let url = `${this.workspacesUrl}/${codebaseId}/workspaces`;
    return this.http
      .get(url, { headers: this.headers })
      .retryWhen(attempts => {
        let count = 0;
        return attempts.flatMap(error => {
          return ++count >= 10 ? Observable.throw(error) : Observable.timer(count * 3000); // Wait for Che to start
        });
      })
      .map(response => {
        return response.json().data as Workspace[];
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Open workspace associated with a codebase.
   *
   * @param url The open codebase URL (e.g., `${this.workspacesUrl}/${codebaseId}/open/${workspaceId}`)
   * @returns {Observable<WorkspaceLinks>}
   */
  openWorkspace(url: string): Observable<WorkspaceLinks> {
    return this.http
      .post(url, null, { headers: this.headers })
      .retry(8) // che-starter timeout is 3 min -- 30 sec default request timeout is not enough
      .map(response => {
        return response.json() as WorkspaceLinks;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  // Private

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }
}
