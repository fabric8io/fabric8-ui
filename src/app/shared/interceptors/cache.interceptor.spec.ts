import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpParams,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable ,  of } from 'rxjs';
import { RequestCache } from '../request-cache.service';
import { CacheInterceptor } from './cache.interceptor';

describe(`CacheHttpInterceptor`, () => {
  const testUrl: string = 'http://localhost/test';
  const oriDateNow: (() => number) = Date.now;

  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let cacheInterceptor: CacheInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RequestCache,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CacheInterceptor,
          multi: true
        },
        CacheInterceptor
      ]
    });
    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);
    cacheInterceptor = TestBed.get(CacheInterceptor);
  });
  afterEach(() => {
    Date.now = oriDateNow;
    httpMock.verify();
  });

  it('cache should expire', () => {
    Date.now = () => 0;

    httpClient.get(testUrl).subscribe();
    httpClient.get(testUrl).subscribe();

    httpMock.expectOne(testUrl);

    // move time forward beyond TTL to expire cache
    Date.now = () => 500;

    httpClient.get(testUrl).subscribe();
    httpMock.expectOne(testUrl);
  });

  it('should only cache GET requests', () => {
    httpClient.get('test-get').subscribe();
    httpClient.get('test-get').subscribe();
    httpClient.post('test-post', {}).subscribe();
    httpClient.post('test-post', {}).subscribe();

    const getRequests = httpMock.match('test-get');
    expect(getRequests.length).toEqual(1);
    // POST request should not be cached
    const postRequests = httpMock.match('test-post');
    expect(postRequests.length).toEqual(2);
  });

  it('cache key should include params and headers', () => {
    const paramOptions = {
      params: new HttpParams().set('foo', 'bar')
    };
    const headerOptions = {
      headers: new HttpHeaders({ foo: 'bar' })
    };

    httpClient.get(testUrl).subscribe();
    httpMock.expectOne(testUrl);

    // Creates a new cache entry based on params.
    // First subscribe caches the response while 2nd subscribe simply uses the cached response
    httpClient.get(testUrl, paramOptions).subscribe();
    httpClient.get(testUrl, paramOptions).subscribe();
    httpMock.expectOne(`${testUrl}?foo=bar`);

    // Creates a new cache entry based on headers.
    httpClient.get(testUrl, headerOptions).subscribe();
    httpClient.get(testUrl, headerOptions).subscribe();
    httpMock.expectOne(testUrl);

    // Creates a new cache entry based on URL.
    httpClient.get('test2').subscribe();
    httpClient.get('test2').subscribe();
    httpMock.expectOne('test2');
  });

  it('should return cached observable and not make several handler requests', fakeAsync(() => {
    const testResponse = 'test response';
    const mockHandler: HttpHandler = {
      handle(): Observable<HttpEvent<string>> {
        return null;
      }
    };
    const handleSpy = spyOn(mockHandler, 'handle').and.returnValue(of({ body: testResponse } as HttpResponse<string>));

    let received1: string = null;
    let received2: string = null;

    const req = { urlWithParams: 'test', method: 'GET' } as HttpRequest<any>;

    cacheInterceptor.intercept(req, mockHandler).subscribe((v: HttpResponse<string>) => {
      received1 = v.body;
    });
    cacheInterceptor.intercept(req, mockHandler).subscribe((v: HttpResponse<string>) => {
      received2 = v.body;
    });

    // tick forward to run observables
    tick(1);

    // should only have made a single handler call
    // and both subscriptions are notified
    expect(handleSpy).toHaveBeenCalledTimes(1);
    expect(received1).toBe(testResponse);
    expect(received2).toBe(testResponse);
  }));
});
