import { Inject, Injectable } from '@angular/core';
import {
  Headers,
  Http,
  Request,
  RequestMethod,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  URLSearchParams,
  XHRBackend
} from '@angular/http';

import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AUTH_API_URL, HttpService , SSO_API_URL } from 'ngx-login-client';
import { AsyncSubject, Observable, Scheduler } from 'rxjs';
import * as uuidV4 from 'uuid/v4';


type CacheItem = {
  asyncResponse: AsyncSubject<Response>;
  timestamp: number;
};

function isGetMethod(method?: string | RequestMethod) {
  return method == null || method === RequestMethod.Get || (typeof method === 'string' && method.toUpperCase() === 'GET');
}

function isGetRequest(url: string | Request, options?: RequestOptionsArgs): boolean {
  return (typeof url === 'string' && (options == null || isGetMethod(options.method))) || isGetMethod((url as Request).method);
}

// Creates a cache key from headers, query params, and URL
function createCacheKey(req: string | Request, options?: RequestOptionsArgs): string {
  let key;
  if (typeof req === 'string') {
    key = req;
    if (options) {
      if (options.params) {
        // params could be a URLSearchParams | string | [key: string]
        if ((options.params as URLSearchParams).paramsMap != null) {
          key += `:${options.params.toString()}`;
        } else if (typeof options.params === 'string') {
          key += `:${options.params}`;
        } else {
          key += `:${JSON.stringify(options.params)}`;
        }
      }
      if (options.headers) {
        key += `:${JSON.stringify(options.headers.toJSON())}`;
      }
    }
  } else {
    key = req.url;
    if (req.headers) {
      key += `:${JSON.stringify(req.headers.toJSON())}`;
    }
  }
  return key;
}

const CACHE_TTL = 200; // cache requests for N milliseconds

@Injectable()
export class Fabric8UIHttpService extends Http {

  private cache: Map<string, CacheItem> = new Map<string, CacheItem>();

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

    if (isGetRequest(url, options)) {
      const cacheKey = createCacheKey(url, options);
      return Observable.create(observer => {
        // check cache for async subject
        let cacheItem = this.cache.get(cacheKey);
        if (!cacheItem || (Date.now() - cacheItem.timestamp > CACHE_TTL)) {
          // cache the async subject
          cacheItem = {
            asyncResponse: new AsyncSubject<Response>(),
            timestamp: Date.now()
          };
          this.cache.set(cacheKey, cacheItem);
          this.makeRequest(urlStr, url, options).subscribe(cacheItem.asyncResponse);
        }

        // Adding Scheduler.async fixes a race condition with routing when using
        // large TTL or routing quickly.
        return cacheItem.asyncResponse.subscribeOn(Scheduler.async).subscribe(observer);
      });
    }

    return this.makeRequest(urlStr, url, options);
  }

  private makeRequest(urlStr: string, url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
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
    return super.request(url, options);
  }

}
