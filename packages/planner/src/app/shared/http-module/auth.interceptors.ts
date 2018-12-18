import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get('planner-req')) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.auth.getToken()}`,
        'Content-Type': `application/json`,
      });
      const authreq = req.clone({
        headers: headers,
      });
      return next.handle(authreq);
    }
    return next.handle(req);
  }
}
