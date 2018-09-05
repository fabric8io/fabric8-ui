import { Inject, Injectable } from '@angular/core';

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AUTH_API_URL } from 'ngx-login-client';
import uuid from 'uuid';


@Injectable()
export class RequestIdInterceptor implements HttpInterceptor {

  constructor(
    @Inject(WIT_API_URL) private witApiUrl: string,
    @Inject(AUTH_API_URL) private authApiUrl: string
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = request.url;

    // Attach a X-Request-Id to all requests that don't have one
    if (url.startsWith(this.witApiUrl) || url.startsWith(this.authApiUrl)) {
      if (!request.headers.has('X-Request-Id')) {
        const newReq = request.clone({
          setHeaders: {
            'X-Request-Id': uuid.v4()
          }
        });
        return next.handle(newReq);
      }
    }

    return next.handle(request);
  }
}
