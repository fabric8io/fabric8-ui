import {Injectable} from "@angular/core";
import {Http, Response, RequestOptions, Request, RequestOptionsArgs, XHRBackend, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {HttpService} from "ngx-login-client";
import * as uuidV4 from "uuid/v4";
import {ApiLocatorService} from "./api-locator.service";

@Injectable()
export class Fabric8UIHttpService extends Http {

  constructor(
    backend: XHRBackend,
    options: RequestOptions,
    private httpService: HttpService,
    private apiLocator: ApiLocatorService) {
    super(backend, options);
  }

  protected get witApiUrl(): string {
    return this.apiLocator.witApiUrl;
  }

  protected get ssoApiUrl(): string {
    return this.apiLocator.ssoApiUrl;
  }


  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    let urlStr = (typeof url === 'string' ? url : url.url);
    // Attach a X-Request-Id to all requests that don't have one
    if (urlStr.startsWith(this.witApiUrl)) {
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
    if (urlStr.startsWith(this.witApiUrl) || urlStr.startsWith(this.ssoApiUrl)) {
      // Only use the HttpService from ngx-login-client for requests to certain endpoints
      return this.httpService.request(url, options);
    } else {
      return super.request(url, options);
    }
  }

}
