import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { StackAnalysesModel } from '../stack-analyses.model';

@Injectable()
export class RenderComponentService {

  private componentAnalysesUrl = process.env.STACK_API_URL + '/analyses';

  constructor(private http: Http, private stackAnalysesModel: StackAnalysesModel) { }


  getComponentAnalyses(data: StackAnalysesModel): Observable<any> {
    return this.http.get(this.componentAnalysesUrl + data.ecosystem +
      '/' + data.pkg + '/' + data.version)
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
