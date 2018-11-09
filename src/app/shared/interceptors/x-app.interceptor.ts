import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FABRIC8_FORGE_API_URL } from '../runtime-console/fabric8-ui-forge-api';

@Injectable()
export class XAppInterceptor implements HttpInterceptor {

  constructor(
    @Inject(FABRIC8_FORGE_API_URL) private forgeApiUrl: string
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = request.url;

    // Attach a X-App to all requests that don't have one
    if (url.startsWith(this.forgeApiUrl) && !request.headers.has('X-App')) {
      const newReq = request.clone({
        setHeaders: {
          'X-App': 'OSIO'
        }
      });
      return next.handle(newReq);
    }

    return next.handle(request);
  }
}
