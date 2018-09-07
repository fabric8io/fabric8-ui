import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { StackReportModel } from '../models/stack-report.model';

@Injectable()
export class PipelineInsightsService {

  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {
    if (this.auth.getToken() !== null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
  }

  getStackAnalyses(url: string, params?: any): Observable<StackReportModel> {
    const options: any = { headers: this.headers, observe: 'response' };
    if (params && params['access_token']) {
      this.headers.set('Authorization', 'Bearer ' + params['access_token']);
    }
    return this.http.get<StackReportModel>(url, options)
      .pipe(map(this.extractData),
      catchError(this.handleError));
  }

  private extractData(res: HttpResponse<StackReportModel>): StackReportModel {
    let body = res.body || {} as StackReportModel;
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
