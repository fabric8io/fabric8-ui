import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
//import { AuthenticationService } from 'ngx-login-client';
//import {OAuthService} from 'angular2-oauth2/oauth-service';
//import { WIT_API_URL } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class AddWorkFlowService {

  private stackWorkItemUrl;

  private headers: Headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
   // private auth: OAuthService
    ) {
    // @Inject(WIT_API_URL) apiUrl: string)
  //   private apiUrl: string) {
    /* if (this.auth.getAccessToken() !== null) {
       this.headers.set('Authorization', 'Bearer ' + this.auth.getAccessToken());
     }
     this.stackWorkItemUrl = 'http://api.prod-preview.openshift.io/api/' + 'workitems'; // apiUrl + 'workitems'; */
    }

  addWorkFlow(workItemData: any): Observable<any> {
    let options = new RequestOptions({ headers: this.headers });
    let body = JSON.stringify(workItemData);
    return this.http.post(this.stackWorkItemUrl, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
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
