import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Logger } from 'ngx-base';
import { Observable } from 'rxjs';

import { WIT_API_URL } from 'ngx-fabric8-wit';
import { Codebase } from './codebase';
import { Workspace, WorkspaceLinks } from './workspace';

@Injectable()
export class TenentService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private userUrl: string;

  constructor(
      private http: Http,
      private logger: Logger,
      private auth: AuthenticationService,
      private userService: UserService,
      @Inject(WIT_API_URL) apiUrl: string) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.userUrl = apiUrl + 'user';
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
