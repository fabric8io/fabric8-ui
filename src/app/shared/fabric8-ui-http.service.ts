import { Injectable, Inject } from '@angular/core';
import {
  Http,
  Response,
  RequestOptions,
  Request,
  RequestOptionsArgs,
  XHRBackend,
  Headers
} from '@angular/http';

import { Observable } from 'rxjs';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { HttpService, SSO_API_URL , AUTH_API_URL } from 'ngx-login-client';

import * as uuidV4 from 'uuid/v4';

@Injectable()
export class Fabric8UIHttpService extends Http {

  constructor(
    backend: XHRBackend,
    options: RequestOptions,
    private httpService: HttpService,
    @Inject(WIT_API_URL) private witApiUrl: string,
    @Inject(AUTH_API_URL) private authApiUrl: string,
    @Inject(SSO_API_URL) private ssoApiUrl: string) {
    super(backend, options);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    let urlStr = (typeof url === 'string' ? url : url.url);
    // Attach a X-Request-Id to all requests that don't have one
    if (urlStr.startsWith(this.witApiUrl) || urlStr.startsWith(this.authApiUrl)) {
      if (typeof url === 'string') {
        if (!options) {
          options = { headers: new Headers() };
        }
        if (!options.headers.has('X-Request-Id')) {
          options.headers.set('X-Request-Id', uuidV4());
        }
      } else {
        if (!url.headers.has('X-Request-Id')) {
          url.headers.set('X-Request-Id', uuidV4());
        }
      }
    }
    if (urlStr.startsWith(this.witApiUrl) || urlStr.startsWith(this.ssoApiUrl) ||  urlStr.startsWith(this.authApiUrl)) {
      // Only use the HttpService from ngx-login-client for requests to certain endpoints
      return this.httpService.request(url, options);
    }
    else {
      return super.request(url, options);
    }
  }

}
