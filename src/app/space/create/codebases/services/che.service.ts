import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Observable } from 'rxjs';

import { Che } from './che';

@Injectable()
export class CheService {
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
    this.workspacesUrl = apiUrl + 'codebases/che';
  }

  /**
   * Get state of Che server
   *
   * @returns {Observable<Che>}
   */
  getState(): Observable<Che> {
    let url = `${this.workspacesUrl}/state`;
    return this.http
      .get(url, { headers: this.headers })
      .map(response => {
        return response.json() as Che;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Start the Che server
   *
   * @returns {Observable<Che>}
   */
  start(): Observable<Che> {
    let url = `${this.workspacesUrl}/start`;
    return this.http
      .patch(url, {}, { headers: this.headers })
      .map(response => {
        return response.json() as Che;
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
