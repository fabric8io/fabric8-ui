import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { WIT_API_URL } from 'ngx-fabric8-wit';

import {StackReportModel} from './models/stack-report.model';

@Injectable()
export class StackAnalysesService {

  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private stackAnalysesUrl: string = '';
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
    private http: Http,
    private auth: AuthenticationService,
  ) {
      if (this.auth.getToken() !== null) {
        this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
      }
  }

  getStackAnalyses(url: string): Observable<any> {
    let options = new RequestOptions({ headers: this.headers });
    let stackReport: StackReportModel = null;
    // url = 'https://gist.githubusercontent.com/jyasveer/36d3197964899eef0f1fcf5a18063b76/raw/7792af364d3d35dc72e766c907db2023e4247e60/stack-analyses-v2-response.json';
    return this.http.get(url, options)
    // return this.http.get(url)
      .map(this.extractData)
      .map((data) => {
        stackReport = data;
        console.log(typeof stackReport);
        console.log(stackReport instanceof StackReportModel);
        return stackReport;
      })
      .catch(this.handleError);
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

  private extractData(res: Response) {
    let body = res.json() || {};
    body['statusCode'] = res.status;
    body['statusText'] = res.statusText;
    console.log(body as StackReportModel);
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
