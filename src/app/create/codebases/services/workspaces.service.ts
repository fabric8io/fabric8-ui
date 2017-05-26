import {Injectable} from "@angular/core";
import {Headers, Http} from "@angular/http";
import {Logger} from "ngx-base";
import {Observable} from "rxjs";
import {Codebase} from "./codebase";
import {Workspace, WorkspaceLinks} from "./workspace";
import {ApiLocatorService} from "../../../shared/api-locator.service";
import {pathJoin} from "fabric8-runtime-console/src/app/kubernetes/model/utils";
import {AuthenticationService} from "../../../shared/authentication.service";

@Injectable()
export class WorkspacesService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
      private http: Http,
      private logger: Logger,
      private auth: AuthenticationService,
      private apiLocator: ApiLocatorService) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
  }

  protected get apiUrl(): string {
    return this.apiLocator.witApiUrl;
  }

  protected get workspacesUrl(): string {
    return pathJoin(this.apiUrl, 'codebases');
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
    let url = `${this.workspacesUrl}/${codebaseId}/edit`;
    return this.http
      .get(url, { headers: this.headers })
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
