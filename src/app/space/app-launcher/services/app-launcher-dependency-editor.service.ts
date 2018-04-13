import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Headers, Http, RequestOptions, Response } from '@angular/http';

import {
    DependencyEditorService,
    HelperService,
    TokenProvider
} from 'ngx-forge';

@Injectable()
export class AppLauncherDependencyEditorService implements DependencyEditorService {

  private END_POINT: string = '';
  private API_BASE: string = 'booster-catalog/';
  private ORIGIN: string = '';

  constructor(
    private http: Http,
    private helperService: HelperService,
    private tokenProvider: TokenProvider
  ) {
    if (this.helperService) {
      this.END_POINT = this.helperService.getBackendUrl();
      this.ORIGIN = this.helperService.getOrigin();
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

  getBoosterInfo(missionId: string, runtimeId: string, runtimeVersion: string): Observable<any> {
    if (missionId && runtimeId) {
      let boosterInfoEndPoint: string = this.END_POINT + this.API_BASE + 'booster';
      boosterInfoEndPoint += `?mission=${missionId}&runtime=${runtimeId}&runtimeVersion=${runtimeVersion}`;
      return this.options.flatMap((option) => {
        return this.http.get(boosterInfoEndPoint, option)
                    .map(response => response.json() as any)
                    .catch(this.handleError);
      });
    }
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
