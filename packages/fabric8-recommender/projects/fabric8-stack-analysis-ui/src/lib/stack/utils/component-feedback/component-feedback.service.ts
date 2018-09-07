import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { MComponentFeedback } from '../../models/ui.model';

@Injectable()
export class ComponentFeedbackService {

  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private FEEDBACK_URL = '';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {
    if (this.auth.getToken() !== null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
  }

  postFeedback(feedback: MComponentFeedback): Observable<any> {
    let options: any = { headers: this.headers, observe: 'response' };
    let body = JSON.stringify(feedback.feedbackTemplate);
    this.FEEDBACK_URL = feedback.baseUrl + 'api/v1/submit-feedback';
    return this.http.post<any>(this.FEEDBACK_URL, body, options)
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }

  private extractData(res: HttpResponse<any>): any {
    let body = res.body || {};
    body['statusCode'] = res.status;
    body['statusText'] = res.statusText;
    return body;
  }

  private handleError(error: HttpErrorResponse) {
    let body: any = {};
    if (error.error instanceof ErrorEvent) {
      body = {
        statusText: error.error.message || error.error.toString()
      };
    } else if (error.status && error.statusText) {
      body = {
        status: error.status,
        statusText: error.statusText
      };
    }
    return Observable.throw(body);
  }

}
