import {Injectable} from "@angular/core";
import {Headers, Http} from "@angular/http";
import {Logger} from "ngx-base";
import {Observable} from "rxjs";
import {Codebase} from "./codebase";
import {Workspace, WorkspaceLinks} from "./workspace";
import {ApiLocatorService} from "../../shared/api-locator.service";
import {pathJoin} from "fabric8-runtime-console/src/app/kubernetes/model/utils";
import {AuthenticationService} from "../../shared/authentication.service";

@Injectable()
export class TenentService {
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

  protected get userUrl(): string {
    return pathJoin(this.apiUrl, 'user');
  }



  /**
   * Update tenent
   *
   * @returns {Observable<Codebase>}
   */
  updateTenent(): Observable<any> {
    let url = `${this.userUrl}/services`;
    return this.http
      .patch(url, null, { headers: this.headers })
      .map(response => {
        return response;
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
