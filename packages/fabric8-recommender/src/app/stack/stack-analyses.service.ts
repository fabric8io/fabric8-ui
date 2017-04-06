import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { WIT_API_URL } from 'ngx-fabric8-wit';

@Injectable()
export class StackAnalysesService {

  private stackAnalysesUrl: string = '';

  private recommenderString: string = 'recommender';
  private doubleSlash: string = '//';
  private dot: string = '.';
  private singleSlash: string = '/';
  private v1Extension: string = 'v1';

  constructor(
    private http: Http,
    @Inject(WIT_API_URL) apiUrl: string,
  ) {
    if(process && process.env && process.env.FABRIC8_RECOMMENDER_API) {
      this.stackAnalysesUrl = process.env.FABRIC8_RECOMMENDER_API;
    } else {
      if(apiUrl) {
        this.stackAnalysesUrl = apiUrl.replace(this.doubleSlash, this.doubleSlash + this.recommenderString + this.dot);
        let len: number = this.stackAnalysesUrl.length;
        if(this.stackAnalysesUrl[len - 1] !== this.singleSlash) {
          this.stackAnalysesUrl += this.singleSlash;
        }
        this.stackAnalysesUrl += this.v1Extension + this.singleSlash;
      }
    }
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
    return Observable.throw(errMsg);
  }

}
