import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/operators/map';

@Injectable()
export class FeedbackService {
  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService) {
      if (this.auth.getToken() !== null) {
        this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
      }
    }

  public submit(feedback: any): Observable<any> {
    let url: string = 'https://recommender.api.openshift.io/api/v1/user-feedback';
    let options = {
      headers: this.headers
    };

    return this.http
      .post<any>(url, JSON.stringify(feedback), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(body: any): any {
    return body || {};
  }

  private handleError(error: HttpErrorResponse) {
    let errMsg: string;
    if (error.error instanceof ErrorEvent) {
      errMsg = error.error.message || error.error.toString();
    } else {
      const body = error.error || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    }
    return Observable.throw(errMsg);
  }
}
