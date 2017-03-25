import { Observable } from 'rxjs';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { HttpService, SSO_API_URL } from 'ngx-login-client';
import { Injectable, Inject } from '@angular/core';
import {
  Http,
  Response,
  RequestOptions,
  Request,
  RequestOptionsArgs,
  XHRBackend
} from '@angular/http';

@Injectable()
export class Fabric8UIHttpService extends Http {

  constructor(
    backend: XHRBackend,
    options: RequestOptions,
    private httpService: HttpService,
    @Inject(WIT_API_URL) private witApiUrl: string,
    @Inject(SSO_API_URL) private ssoApiUrl: string) {
    super(backend, options);
  }

  request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
    // Only use the HttpService from ngx-login-client for requests to certain endpoints
    let urlStr = (typeof url === 'string' ? url : url.url);
    if (urlStr.startsWith(this.witApiUrl) || urlStr.startsWith(this.ssoApiUrl)) {
      return this.httpService.request(url, options);
    } else {
      return super.request(url, options);
    }
  }

}
