import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { StackAnalysesModel } from './stack-analyses.model';

@Injectable()
export class RenderComponentService {

  private componentAnalysesUrl = 'http://ose-vm1.lab.eng.blr.redhat.com:32000/api/v1/analyses/';

  constructor(private http: Http, private stackAnalysesModel: StackAnalysesModel) { }


  getComponentAnalyses(data:StackAnalysesModel): Observable<any> {
    return this.http.get(this.componentAnalysesUrl+data.ecosystem+"/"+ data.package+"/"+data.version)
      .map(this.extractData)
      .catch(this.handleError);
  }
  private extractData(res: Response) {
    debugger;
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
