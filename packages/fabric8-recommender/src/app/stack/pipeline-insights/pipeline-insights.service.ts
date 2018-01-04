import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/operators/map';

import { WIT_API_URL } from 'ngx-fabric8-wit';

import { StackReportModel } from '../models/stack-report.model';

@Injectable()
export class PipelineInsightsService {

  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private stackAnalysesUrl: string = '';

  constructor(
    private http: Http,
    private auth: AuthenticationService,
  ) {
      if (this.auth.getToken() !== null) {
        this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
      }
  }

  getStackAnalyses(url: string, params?: any): Observable<any> {
    console.log('stack service', params);
    let options = new RequestOptions({ headers: this.headers });
    let stackReport: StackReportModel = null;
    if (params && params['access_token']) {
      this.headers.set('Authorization', 'Bearer ' + params['access_token']);
      options = new RequestOptions({ headers: this.headers });
    }
    return this.http.get(url, options)
      .map(this.extractData)
      .map((data) => {
        stackReport = data;
        return stackReport;
      })
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json() || {};
    body['statusCode'] = res.status;
    body['statusText'] = res.statusText;
    return body as StackReportModel;
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
