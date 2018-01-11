import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/operators/map';

import { MComponentFeedback } from '../../models/ui.model';

@Injectable()
export class ComponentFeedbackService {

  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private FEEDBACK_URL: string = '';

  constructor(
    private http: Http,
    private auth: AuthenticationService,
  ) {
      if (this.auth.getToken() !== null) {
        this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
      }
  }

  postFeedback(feedback: MComponentFeedback): Observable<any> {
    let options = new RequestOptions({ headers: this.headers });
    let body = JSON.stringify(feedback.feedbackTemplate);
    this.FEEDBACK_URL = feedback.baseUrl + '/api/v1/submit-feedback';
    console.log('Feedback Request: ', body);
    return this.http.post(this.FEEDBACK_URL, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json() || {};
    body['statusCode'] = res.status;
    body['statusText'] = res.statusText;
    return body;
  }

  private handleError(error: Response | any) {
    let body: any = {};
    if (error instanceof Response) {
      if (error && error.status && error.statusText) {
        body = {
          status: error.status,
          statusText: error.statusText
        };
      }
    } else {
      body = {
        statusText: error.message ? error.message : error.toString()
      };
    }
    return Observable.throw(body);
  }

}
