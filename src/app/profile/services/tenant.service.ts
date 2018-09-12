import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class TenantService {
  private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  private userUrl: string;

  constructor(
      private http: HttpClient,
      private logger: Logger,
      private auth: AuthenticationService,
      @Inject(WIT_API_URL) apiUrl: string) {
    if (this.auth.getToken() != undefined) {
      this.headers = this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
    this.userUrl = apiUrl + 'user';
  }

  /**
   * Update tenant
   *
   * @returns {Observable<any>}
   */
  updateTenant(): Observable<any> {
    let url = `${this.userUrl}/services`;
    return this.http
      .patch(url, null, { headers: this.headers, observe: 'response', responseType: 'text' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error);
        })
      );
  }

  /**
   * Cleanup tenant
   * @returns {Observable<any>}
   */
  cleanupTenant(): Observable<any> {
    let url = `${this.userUrl}/services`;
    return this.http
      .delete(url, { headers: this.headers, responseType: 'text' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error);
        }),
        map(() => null)
      );
  }

  // Private

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }
}
