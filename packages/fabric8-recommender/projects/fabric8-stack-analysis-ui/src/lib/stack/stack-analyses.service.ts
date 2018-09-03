import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs';
// import 'rxjs/add/operator/catch';
// import 'rxjs/operators/map';

import { catchError, map } from 'rxjs/operators';

import { StackReportModel } from './models/stack-report.model';

@Injectable()
export class StackAnalysesService {

  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private cvssScale: any = {
    low: {
      start: 0.0,
      end: 3.9,
      iconClass: 'pficon pficon-warning-triangle-o',
      displayClass: 'progress-bar-warning'
    },
    medium: {
      start: 4.0,
      end: 6.9,
      iconClass: 'pficon pficon-warning-triangle-o',
      displayClass: 'progress-bar-warning'
    },
    high: {
      start: 7.0,
      end: 10.0,
      iconClass: 'pficon pficon-warning-triangle-o warning-red-color',
      displayClass: 'progress-bar-danger'
    }
  };

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

  getCvssObj(score: number): any {
    if (score) {
      let iconClass: string = this.cvssScale.medium.iconClass;
      let displayClass: string = this.cvssScale.medium.displayClass;
      if (score >= this.cvssScale.high.start) {
        iconClass = this.cvssScale.high.iconClass;
        displayClass = this.cvssScale.high.displayClass;
      }
      return {
        iconClass: iconClass,
        displayClass: displayClass,
        value: score,
        percentScore: (score / 10 * 100)
      };
    }
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
