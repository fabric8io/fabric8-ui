import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Headers, Http, RequestOptions, Response } from '@angular/http';

import {
    DependencyEditorService,
    HelperService,
    TokenProvider,
    URLProvider
} from 'ngx-forge';

@Injectable()
export class AppLauncherDependencyEditorService implements DependencyEditorService {

  private END_POINT: string = '';
  private API_BASE: string = 'booster-catalog/';
  private ORIGIN: string = '';
  private ANALYTICS_END_POINT: string = '';

  constructor(
    private http: Http,
    private helperService: HelperService,
    private tokenProvider: TokenProvider,
    private urlProvider: URLProvider
  ) {
    if (this.helperService) {
      this.END_POINT = this.helperService.getBackendUrl();
      this.ORIGIN = this.helperService.getOrigin();
    }
    if (this.urlProvider) {
      this.ANALYTICS_END_POINT = this.urlProvider.getRecommenderAPIUrl();
    }
  }

  private get options(): Observable<RequestOptions> {
    let headers = new Headers();
    headers.append('X-App', this.ORIGIN);
    return Observable.fromPromise(this.tokenProvider.token.then((token) => {
      headers.append('Authorization', 'Bearer ' + token);
      return new RequestOptions({
          headers: headers
      });
    }));
  }

  getCoreDependencies(runtimeId: string): Observable<any> {
    if (runtimeId) {
      let coreDependenciesEndPoint: string = this.ANALYTICS_END_POINT + `/api/v1/get-core-dependencies/${runtimeId}`;
      return this.options.flatMap((option) => {
        option.headers.delete('X-App');
        return this.http.get(coreDependenciesEndPoint, option)
                    .map(response => response.json() as any)
                    .catch(this.handleError);
      });
    }
    return Observable.empty();
  }

  private handleError(error: Response | any) {
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
