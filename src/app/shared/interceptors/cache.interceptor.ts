import { Injectable } from '@angular/core';

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';

import { AsyncSubject, Observable, Scheduler } from 'rxjs';
import { RequestCache } from '../request-cache.service';

/**
 * If request is cachable (e.g., GET) and
 * response is in cache return the cached response as observable.
 *
 * If not in cache or not cachable,
 * pass request through to next()
 */
@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCache) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // continue if not cachable.
    if (!isCachable(req)) {
      return next.handle(req);
    }

    return Observable.create(observer => {
      let asyncResponse = this.cache.get(req);

      if (!asyncResponse) {
        asyncResponse = new AsyncSubject<HttpResponse<any>>();
        this.cache.set(req, asyncResponse);
        next.handle(req).subscribe(asyncResponse);
      }

      return asyncResponse.subscribeOn(Scheduler.async).subscribe(observer);
    });
  }
}


/** Is this request cachable? */
function isCachable(req: HttpRequest<any>) {
  // Only GET requests are cachable
  return req.method === 'GET';
}
