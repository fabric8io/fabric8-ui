import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Workspace, WorkspaceLinks } from './workspace';

interface WorkspacesResponse {
  data: Workspace[];
}

@Injectable()
export class WorkspacesService {
  private readonly headers: HttpHeaders;

  private readonly workspacesUrl: string;

  constructor(
    private http: HttpClient,
    private logger: Logger,
    private auth: AuthenticationService,
    @Inject(WIT_API_URL) apiUrl: string,
  ) {
    let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (this.auth.getToken() != undefined) {
      headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
    this.headers = headers;
    this.workspacesUrl = `${apiUrl}codebases`;
  }

  /**
   * Create a workspace for given codebase ID
   *
   * @param codebaseId The ID associated with the given workspace
   * @returns {Observable<Codebase>}
   */
  createWorkspace(codebaseId: string): Observable<WorkspaceLinks> {
    const url: string = `${this.workspacesUrl}/${codebaseId}/create`;
    return this.http
      .post<WorkspaceLinks>(url, null, { headers: this.headers })
      .pipe(
        catchError(
          (error: HttpErrorResponse): Observable<WorkspaceLinks> => this.handleError(error),
        ),
      );
  }

  /**
   * Get workspaces for given codebase ID
   *
   * @param codebaseId The ID associated with the given codebase
   * @returns {Observable<Codebase>}
   */
  getWorkspaces(codebaseId: string): Observable<Workspace[]> {
    const url: string = `${this.workspacesUrl}/${codebaseId}/workspaces`;
    // TODO: remove the old url when it is not needed.
    const old_url: string = `${this.workspacesUrl}/${codebaseId}/edit`;
    return this.http.get<WorkspacesResponse>(url, { headers: this.headers }).pipe(
      map((response: WorkspacesResponse): Workspace[] => response.data),
      catchError(
        (error: HttpErrorResponse): Observable<Workspace[]> => {
          // For some reason 'status: 0' is returned when endpoint does not exist
          if (error.status === 404 || error.status === 0) {
            return this.http.get<WorkspacesResponse>(old_url, { headers: this.headers }).pipe(
              map((response: WorkspacesResponse): Workspace[] => response.data),
              catchError(
                (error: HttpErrorResponse): Observable<Workspace[]> => this.handleError(error),
              ),
            );
          }
          return this.handleError(error);
        },
      ),
    );
  }

  /**
   * Open workspace associated with a codebase.
   *
   * @param url The open codebase URL (e.g., `${this.workspacesUrl}/${codebaseId}/open/${workspaceId}`)
   * @returns {Observable<WorkspaceLinks>}
   */
  openWorkspace(url: string): Observable<WorkspaceLinks> {
    return this.http
      .post<WorkspaceLinks>(url, null, { headers: this.headers })
      .pipe(
        catchError(
          (error: HttpErrorResponse): Observable<WorkspaceLinks> => this.handleError(error),
        ),
      );
  }

  // Private

  private handleError(error: HttpErrorResponse): Observable<any> {
    this.logger.error(error);
    return observableThrowError(error.message || error);
  }
}
