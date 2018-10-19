import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HelperService,
  Projectile,
  ProjectSummaryService
} from 'ngx-launcher';
import { AuthenticationService } from 'ngx-login-client';
import { Observable,  throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AppLauncherProjectSummaryService implements ProjectSummaryService {

  // TODO: remove the hardcodes
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Git-Provider': 'GitHub'
  });
  private END_POINT: string = '';
  private API_BASE_CREATE: string = 'osio/launch';
  private API_BASE_IMPORT: string = 'osio/import';
  private ORIGIN: string = '';

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private auth: AuthenticationService
  ) {
    this.END_POINT = this.helperService.getBackendUrl();
    this.ORIGIN = this.helperService.getOrigin();
    if (this.auth.getToken() != null) {
      this.headers = this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
    if (this.ORIGIN) {
      this.headers = this.headers.set('X-App', this.ORIGIN);
    }
  }

  /**
   * Set up the project for the given summary
   *
   * @param  {Summary} summary
   * @param  {string} spaceId
   * @param  {string} spaceName
   * @param  {boolean} isImport
   * @returns Observable
   */
  setup(summary: Projectile<any>, retry?: number): Observable<any> {
    this.headers = this.headers.set('X-Execution-Step-Index', String(retry || 0));
    let summaryEndPoint = this.END_POINT + (summary.getState('MissionRuntime') ? this.API_BASE_CREATE : this.API_BASE_IMPORT);
    return this.http
      .post(summaryEndPoint, summary.toHttpPayload(), { headers: this.headers }).pipe(
      catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string = '';
    if (error instanceof HttpResponse) {
      if (error.status !== 401) {
        const body = error.body || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return observableThrowError(errMsg);
  }
}
