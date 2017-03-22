import { RECOMMENDER_API_URL } from './recommender-api';
import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Logger } from 'ngx-base';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class StackAnalysesService {

  private stackAnalysesUrl;

  constructor(
    private http: Http,
    private logger: Logger,
    @Inject(RECOMMENDER_API_URL) apiUrl: string
  ) {
    this.stackAnalysesUrl = apiUrl;
  }

  getStackAnalyses(id: string): Observable<any> {
    return this.http.get(this.buildStackAnalysesUrl(id))
      .map(this.extractData)
      .catch(this.handleError);
  }

  private buildStackAnalysesUrl(id: string): string {
    return this.stackAnalysesUrl + 'stack-analyses/' + id;
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.result || {};
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
    this.logger.error(errMsg);
    return Observable.throw(errMsg);
  }

}
