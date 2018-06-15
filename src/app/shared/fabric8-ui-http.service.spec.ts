import { discardPeriodicTasks, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import {
  Headers,
  Http,
  HttpModule,
  Request,
  RequestMethod,
  RequestOptions,
  RequestOptionsArgs, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { createMock } from 'testing/mock';

import { Fabric8UIHttpService } from './fabric8-ui-http.service';

import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AUTH_API_URL, HttpService , SSO_API_URL } from 'ngx-login-client';

describe('Fabric8 http service', () => {
  let httpService: Fabric8UIHttpService;
  let mockService: MockBackend;
  const oriDateNow: (() => number) = Date.now;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        MockBackend,
        {
          provide: XHRBackend,
          useExisting: MockBackend
        },
        { provide: HttpService, useValue: createMock(HttpService) },
        { provide: WIT_API_URL, useValue: 'http://example.com'},
        { provide: AUTH_API_URL, useValue: 'http://example.com'},
        { provide: SSO_API_URL, useValue: 'http://example.com'},
        Fabric8UIHttpService
      ]
    });

  });

  beforeEach(inject(
    [Fabric8UIHttpService, MockBackend],
    (service: Fabric8UIHttpService, mock: MockBackend) => {
      httpService = service;
      mockService = mock;
    }
  ));

  afterEach(() => {
    Date.now = oriDateNow;
  });

  it('cache should expire', () => {
    Date.now = () => 0;

    let httpRequestCount = 0;
    mockService.connections.subscribe((connection: any) => {
      httpRequestCount++;
      connection.mockRespond(new Response(new ResponseOptions()));
    });

    httpService.request('test').subscribe(() => {});
    httpService.request('test').subscribe(() => {});
    expect(httpRequestCount).toBe(1);

    // move time forward beyond TTL to expire cache
    Date.now = () => 500;

    httpService.request('test').subscribe(() => {});
    expect(httpRequestCount).toBe(2);
  });

 it('should only cache GET requests', () => {
    let httpRequestCount = 0;
    mockService.connections.subscribe((connection: any) => {
      httpRequestCount++;
      connection.mockRespond(new Response(new ResponseOptions()));
    });

    // POST request should nto cache
    const request: Request = new Request({url: 'test1', method: 'POST'});
    httpService.request(request).subscribe(() => {});
    httpService.request(request).subscribe(() => {});
    expect(httpRequestCount).toBe(2);
  });

  it('cache key should include params and headers', () => {
    let httpRequestCount = 0;
    mockService.connections.subscribe((connection: any) => {
      httpRequestCount++;
      connection.mockRespond(new Response(new ResponseOptions()));
    });

    httpService.request('test').subscribe(() => {});
    expect(httpRequestCount).toBe(1);

    // Creates a new cache entry based on params.
    // First subscribe caches the response while 2nd subscribe simply uses the cached response
    httpService.request('test', {params: {foo: 'bar'}}).subscribe(() => {});
    httpService.request('test', {params: {foo: 'bar'}}).subscribe(() => {});
    expect(httpRequestCount).toBe(2);

    // Creates a new cache entry based on headers.
    httpService.request('test', {headers: new Headers({foo: 'bar'})}).subscribe(() => {});
    httpService.request('test', {headers: new Headers({foo: 'bar'})}).subscribe(() => {});
    expect(httpRequestCount).toBe(3);

    // Creates a new cache entry based on URL.
    httpService.request('test2').subscribe(() => {});
    httpService.request('test2').subscribe(() => {});
    expect(httpRequestCount).toBe(4);
  });

  it('should return cached observable and not make several network requests', fakeAsync(() => {
    const testResponse = 'test response';
    let httpRequestCount = 0;

    // create a delayed mock connection
    mockService.connections.delay(1).subscribe((connection: any) => {
      httpRequestCount++;
      connection.mockRespond(new Response(new ResponseOptions({
        body: testResponse
      })));
    });

    let received1: string = null;
    let received2: string = null;

    // validate that after multiple subscriptions, we have not yet received the http response
    httpService.request('test').subscribe((v) => {
      received1 = v.text();
    });
    expect(httpRequestCount).toBe(0);
    expect(received1).toBeNull();

    httpService.request('test').subscribe((v) => {
      received2 = v.text();
    });
    expect(httpRequestCount).toBe(0);
    expect(received2).toBeNull();

    // tick forward to receive the http response
    tick(100);

    // should only have made a single http call
    // and both subscriptions are notified
    expect(httpRequestCount).toBe(1);
    expect(received1).toBe(testResponse);
    expect(received2).toBe(testResponse);
  }));
});
