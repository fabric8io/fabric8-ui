import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';
import { WIT_API_URL, Contexts } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/operators/map';

@Injectable()
export class AddWorkFlowService {

  private stackWorkItemUrl;

  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private workItemsRoute: string = 'workitems';
  private spacesString: string = 'spaces';
  private spaceId: string;

  constructor(
    private http: Http,
    @Inject(WIT_API_URL) apiUrl: string,
    private auth: AuthenticationService,
    private context: Contexts
  ) {
      if (this.auth.getToken() !== null) {
        this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
      }

      if (this.context && this.context.current) {
        this.context.current.subscribe(currentContext => {
          if (currentContext.space) {
            this.spaceId = currentContext.space.id;
            this.stackWorkItemUrl = apiUrl + this.spacesString + '/' + this.spaceId + '/' + this.workItemsRoute;
          }
        });
      }
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
