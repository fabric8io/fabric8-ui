import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RequestIdInterceptor } from './request-id.interceptor';

import uuid from 'uuid';

import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AUTH_API_URL } from 'ngx-login-client';

fdescribe(`AuthHttpInterceptor`, () => {
  const testUrl: string = 'http://example.com/test';
  const testUUID: string = 'some-unique-id';

  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: WIT_API_URL, useValue: 'http://example.com' },
        { provide: AUTH_API_URL, useValue: 'http://example.com' },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RequestIdInterceptor,
          multi: true
        }
      ]
    });
    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);
    spyOn(uuid, 'v4').and.returnValue(testUUID);
  });
  afterEach(() => {
    httpMock.verify();
  });

  fit('should add an Authorization header', () => {
    httpClient.get(testUrl).subscribe(() => {});

    const req = httpMock.expectOne(testUrl);

    expect(req.request.headers.has('X-Request-Id'));
    expect(req.request.headers.get('X-Request-Id')).toBe(testUUID);
  });
});
