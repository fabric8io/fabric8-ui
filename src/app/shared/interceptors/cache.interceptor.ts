import { Injectable } from '@angular/core';

import {
  HttpHandler, HttpInterceptor,
  HttpRequest, HttpResponse
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

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // continue if not cachable.
    if (!isCachable(req)) {
      return next.handle(req);
    }

    const cachedResponse = this.cache.get(req);

    return Observable.create(observer => {
      if (cachedResponse) {
        return cachedResponse.subscribeOn(Scheduler.async).subscribe(observer);
      }

      const asyncResponse = new AsyncSubject<HttpResponse<any>>();
      this.cache.set(req, asyncResponse);
      return next.handle(req).subscribe(asyncResponse);
    });
  }
}


/** Is this request cachable? */
function isCachable(req: HttpRequest<any>) {
  // Only GET requests are cachable
  return req.method === 'GET';
}
