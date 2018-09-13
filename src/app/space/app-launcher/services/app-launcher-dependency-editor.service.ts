import {
  HttpClient, HttpErrorResponse,
  HttpHeaders, HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    DependencyEditorService,
    HelperService,
    URLProvider
} from 'ngx-launcher';
import { AuthenticationService } from 'ngx-login-client';
import { empty as observableEmpty, Observable,  throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AppLauncherDependencyEditorService implements DependencyEditorService {

  private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  private END_POINT: string = '';
  private API_BASE: string = 'booster-catalog/';
  private ORIGIN: string = '';
  public ANALYTICS_END_POINT: string = '';


  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private helperService: HelperService,
    private urlProvider: URLProvider
  ) {
    if (this.helperService) {
      this.END_POINT = this.helperService.getBackendUrl();
      this.ORIGIN = this.helperService.getOrigin();
    }
    if (this.urlProvider) {
      this.ANALYTICS_END_POINT = this.urlProvider.getRecommenderAPIUrl();
    }
    if (this.auth.getToken() != null) {
      this.headers = this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
  }

  getCoreDependencies(runtimeId: string): Observable<any> {
    if (this.ORIGIN) {
      this.headers = this.headers.set('X-App', this.ORIGIN);
    }
    if (runtimeId) {
      let coreDependenciesEndPoint: string = this.ANALYTICS_END_POINT + `/api/v1/get-core-dependencies/${runtimeId}`;
      return this.http.get(coreDependenciesEndPoint, { headers: this.headers }).pipe(catchError(this.handleError));
    }
    return observableEmpty();
  }

  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    if (error instanceof HttpResponse) {
      const body = error.body || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return observableThrowError(errMsg);
  }
}
