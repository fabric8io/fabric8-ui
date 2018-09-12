import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from 'ngx-login-client';
import { FABRIC8_JENKINS_API_URL } from './runtime-console/fabric8-ui-jenkins-api';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';


@Injectable()
export class JenkinsService {

  constructor(
      private http: HttpClient,
      private authService: AuthenticationService,
      @Inject(FABRIC8_JENKINS_API_URL) private jenkinsApiUrl: string
  ) { }


  /**
  * Get Jenkins Status associated with given user
  *
  * @returns {Observable<any>}
  */
  getJenkinsStatus(): Observable<any> {
      const url = this.jenkinsApiUrl + '/api/jenkins/start';
      const token = this.authService.getToken();
      const httpOptions = {
        headers: new HttpHeaders({'Authorization': 'Bearer ' + token})
      };
      return this.http
        .post(url, null, httpOptions)
        .pipe(
          catchError((err: HttpErrorResponse) => {
              return this.handleError(err);
          })
        );
  }

  private handleError(error: HttpErrorResponse) {
    let errMsg: string;
    if (error instanceof HttpResponse) {
      const body = error.body || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
