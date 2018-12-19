import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class TenantService {
  private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  private tenantUrl: string;

  constructor(
    private http: HttpClient,
    private logger: Logger,
    private auth: AuthenticationService,
    @Inject(WIT_API_URL) apiUrl: string,
  ) {
    if (this.auth.getToken() != undefined) {
      this.headers = this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
    this.tenantUrl = apiUrl + 'user/services';
  }

  /**
   * Get user tenant services
   * @returns {Observable<any>}
   */
  getTenant(): Observable<any> {
    return this.http.get(this.tenantUrl, { headers: this.headers }).pipe(
      map((res: any) => res.data),
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error);
      }),
    );
  }

  /**
   * Update tenant
   *
   * @returns {Observable<any>}
   */
  updateTenant(): Observable<any> {
    return this.http
      .patch(this.tenantUrl, null, {
        headers: this.headers,
        observe: 'response',
        responseType: 'text',
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error);
        }),
      );
  }

  /**
   * Cleanup tenant
   * @returns {Observable<any>}
   */
  cleanupTenant(): Observable<any> {
    return this.http.delete(this.tenantUrl, { headers: this.headers, responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error);
      }),
      map(() => null),
    );
  }

  // Private

  private handleError(error: any) {
    this.logger.error(error);
    return observableThrowError(error.message || error);
  }
}
