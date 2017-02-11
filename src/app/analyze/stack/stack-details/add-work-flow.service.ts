import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class AddWorkFlowService {

  private stackWorkItemUrl = 'http://demo.api.almighty.io/api/workitems';
  private authoBearerToken = `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6ImphaXZhcmRoYW4gS3VtYXIiLCJpbWFnZVVSTCI6Imh0dHBzOi8vd3d3LmdyYXZhdGFyLmNvbS9hdmF0YXIvOTY4YWZjOTgwY2YyZjE0NzVjNTExMmM4ZGYwMjhhNTIuanBnIiwidXVpZCI6ImU4MmRlNzc1LWRhNjQtNDIwMi04MTYzLTAyMWJhNjU1MzI3ZCJ9.YSl4FvcfXw0r2PfZ6pIj8SRZtMX_CtmxDHaM439RdaaZmeDzfc90IeU1UaP4-Sgz_onAp2BPrczxVFFSa_dwdwi7NRV6BTAtBdMYldH7VTsgeQlNUNcUuX6Pzj4K45jiB3Y367eWILniHKXmLdA0qZPO9R5Cd5Gu44TfMNM2SIJiQXArGF9FaQ1TWTS9QVQkm7yQ7a6qxlRMdBLPWKp0OSyF--BtI7kWAJj83opHwaLvh8EZZRoRsy9yBefpzU2c2odbI3sb137jic7HCPq_c8M7YTdXr93IEyodGVoLRKIPw6mGBShCo9wIWZ7u5aNcuxis6VcEvO_OhYxnr33BAw`;

  constructor(private http: Http) { }

  addWorkFlow(workItemData: any): Observable<any> {

    let headers = new Headers({ 'Content-Type': 'application/json',
                                'Authorization': this.authoBearerToken });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(workItemData);
    return this.http.post(this.stackWorkItemUrl, body, options)
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
