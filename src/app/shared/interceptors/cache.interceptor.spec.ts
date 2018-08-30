import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CacheInterceptor } from './cache.interceptor';

import { RequestCache } from '../request-cache.service';

describe(`AuthHttpInterceptor`, () => {
  const testUrl: string = 'http://localhost/test';
  const oriDateNow: (() => number) = Date.now;

  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RequestCache,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CacheInterceptor,
          multi: true
        }
      ]
    });
    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);

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
      headers: new HttpHeaders({foo: 'bar'})
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
});
