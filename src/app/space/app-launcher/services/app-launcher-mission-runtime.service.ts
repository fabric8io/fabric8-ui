import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

import {
  HelperService,
  Mission,
  MissionRuntimeService,
  Runtime,
  TokenProvider
} from 'ngx-forge';

@Injectable()
export class AppLauncherMissionRuntimeService implements MissionRuntimeService {

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

   getMissions(): Observable<Mission[]> {
    let missionEndPoint: string = this.END_POINT + this.API_BASE + 'missions';
    missionEndPoint += `?runsOn=${this.ORIGIN}`;
    return this.options.flatMap((option) => {
      return this.http.get(missionEndPoint, option)
        .map(response => response.json() as Mission[])
        .catch(this.handleError);
    });
  }

   getRuntimes(): Observable<Runtime[]> {
    let runtimeEndPoint: string = this.END_POINT + this.API_BASE + 'runtimes';
    runtimeEndPoint += `?runsOn=${this.ORIGIN}`;
    return this.options.flatMap((option) => {
      return this.http.get(runtimeEndPoint, option)
        .map(response => response.json() as Runtime[])
        .catch(this.handleError);
    });
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
