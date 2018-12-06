/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'ngx-login-client';
import { CacheInterceptor } from './cache.interceptor';
import { RequestIdInterceptor } from './request-id.interceptor';
import { XAppInterceptor } from './x-app.interceptor';

/** Http interceptor providers in outside-in order */
export const HttpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: RequestIdInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: XAppInterceptor, multi: true }
];
