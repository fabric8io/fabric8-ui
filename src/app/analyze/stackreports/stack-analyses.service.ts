import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class StackAnalysesService {
  //let id = '888d1fa0d88e4fbeab7e0e20d21f6912';
  private stackAnalysesUrl = 'http://ose-vm1.lab.eng.blr.redhat.com:32000/api/v1/stack-analyses/888d1fa0d88e4fbeab7e0e20d21f6912';

  constructor(private http: Http) { }

  getStackAnalyses(): Observable<any> {
    return this.http.get(this.stackAnalysesUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }
  private extractData(res: Response) {
    debugger;
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
    console.error(errMsg);
    return Observable.throw(errMsg);
  }



}
