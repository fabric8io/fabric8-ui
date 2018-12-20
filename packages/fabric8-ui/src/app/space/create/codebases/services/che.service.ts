import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Che } from './che';

@Injectable()
export class CheService {
  private readonly headers;
  private readonly workspacesUrl: string;

  constructor(
    private http: HttpClient,
    private logger: Logger,
    private auth: AuthenticationService,
    @Inject(WIT_API_URL) apiUrl: string,
  ) {
    let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (this.auth.getToken() != undefined) {
      headers = headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.headers = headers;
    this.workspacesUrl = apiUrl + 'codebases/che';
  }

  /**
   * Get state of Che server
   *
   * @returns {Observable<Che>}
   */
  getState(): Observable<Che> {
    const url: string = `${this.workspacesUrl}/state`;
    return this.http
      .get<Che>(url, { headers: this.headers })
      .pipe(catchError((error: HttpErrorResponse): Observable<Che> => this.handleError(error)));
  }

  /**
   * Start the Che server
   *
   * @returns {Observable<Che>}
   */
  start(): Observable<Che> {
    const url: string = `${this.workspacesUrl}/start`;
    return this.http
      .patch<Che>(url, {}, { headers: this.headers })
      .pipe(catchError((error: HttpErrorResponse): Observable<Che> => this.handleError(error)));
  }

  // Private

  private handleError(error: HttpErrorResponse): Observable<Che> {
    this.logger.error(error);
    return observableThrowError(error.message || error);
  }
}
