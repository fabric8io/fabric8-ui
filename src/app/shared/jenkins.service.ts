import { Inject, Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from 'ngx-login-client';
import { FABRIC8_JENKINS_API_URL } from './runtime-console/fabric8-ui-jenkins-api';


@Injectable()
export class JenkinsService {

    constructor(
        private http: Http,
        private authService: AuthenticationService,
        @Inject(FABRIC8_JENKINS_API_URL) private jenkinsApiUrl: string
    ) { }


   /**
   * Get Jenkins Status associated with given user
   *
   * @returns {Observable<any>}
   */
    getJenkinsStatus(): Observable<any> {
        let jenkinsUrl = this.jenkinsApiUrl;
        let url = jenkinsUrl + '/api/jenkins/start';
        let token = this.authService.getToken();
        console.log('about to invoke ' + url);
        let options = new RequestOptions();
        let headers = new Headers();
        headers.set('Authorization', 'Bearer ' + token);
        options.headers = headers;
        let body = null;
        let res = this.http.post(url, body, options)
            .map(response => response.json() as any)
            .catch(error => {
                return this.handleError(error);
            });
        return res;
    }


  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
