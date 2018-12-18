import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { flatMap, retryWhen } from 'rxjs/operators';

@Injectable()
export class HttpClientService {
  constructor(private http: HttpClient) {}

  private setHeaders(options) {
    let headers = new HttpHeaders();
    // This is a hack to forcefully define no extra header
    // to the request
    if (Object.keys(options).length && Object.keys(options)[0] === 'no-header') {
      return headers;
    }
    Object.entries<any>(options).forEach(([key, value]) => {
      headers = headers.append(key, value);
    });
    // this header is added to identify that it's a planner request to
    // the auth interceptoe. This header is removed in the interceptor
    headers = headers.append('planner-req', 'planner-req');
    return headers;
  }

  private requestRetryLogic(attempts: Observable<any>): Observable<any> {
    console.log('retryWhen callback');
    let count = 0;
    return attempts.pipe(
      flatMap((error) => {
        if (error.status == 0) {
          // Server offline :: keep trying
          console.log('########### Now offline #############', error);
          return timer(++count * 1000); // TODO ng6: use timer from rxjs 6
        } else if (error.status == 500 || error.status == 401) {
          // Server error :: Try 3 times then throw error
          return ++count >= 3 ? throwError(error) : timer(1000);
        } else {
          return throwError(error);
        }
      }),
    );
  }

  public get<T>(url: string, options = {}): Observable<T> {
    console.log('GET request initiated');
    console.log('URL - ', url);
    console.log('Options - ', options);
    return this.http
      .get<any | T>(url, { headers: this.setHeaders(options) })
      .pipe(retryWhen((attempts) => this.requestRetryLogic(attempts)));
  }

  public post<T>(url: string, body: any, options: any = {}): Observable<T> {
    console.log('GET request initiated');
    console.log('URL - ', url);
    console.log('Options - ', options);
    return this.http
      .post<any | T>(url, body, { headers: this.setHeaders(options) })
      .pipe(retryWhen((attempts) => this.requestRetryLogic(attempts)));
  }

  public patch<T>(url: string, body: any, options = {}): Observable<T> {
    console.log('PATCH request initiated');
    console.log('URL - ', url);
    console.log('Body - ', body);
    console.log('Options - ', options);
    return this.http
      .patch<T>(url, body, { headers: this.setHeaders(options) })
      .pipe(retryWhen((attempts) => this.requestRetryLogic(attempts)));
  }

  public delete(url: string): Observable<any> {
    console.log('DELETE request initiated');
    console.log('URL - ', url);
    return this.http
      .delete(url, { responseType: 'text', headers: this.setHeaders({}) })
      .pipe(retryWhen((attempts) => this.requestRetryLogic(attempts)));
  }
}

/**
 * This is to bypass all interceptors
 * (mainly for detailPage on firefox to solve the redirection problem)
 *
 * Working of HttpHandler, HttpBackend according to Angular code documentation :
 *
 * HttpHandler Transforms an `HttpRequest` into a stream of `HttpEvent`s, one of which will likely be a
 * `HttpResponse`.
 * `HttpHandler` is injectable. When injected, the handler instance dispatches requests to the
 * first interceptor in the chain, which dispatches to the second, etc, eventually reaching the
 * `HttpBackend`.
 * In an `HttpInterceptor`, the `HttpHandler` parameter is the next interceptor in the chain.
 *
 * HttpBackend is the final `HttpHandler` which will dispatch the request via browser HTTP APIs to a backend
 *
 * When injected, `HttpBackend` dispatches requests directly to the backend, without going
 * through the interceptor chain.
 *
 */

@Injectable()
export class HttpBackendClient extends HttpClient {
  constructor(handler: HttpBackend) {
    // inject the HttpBackend to
    // disptach the request directly to backend
    super(handler);
  }
}
