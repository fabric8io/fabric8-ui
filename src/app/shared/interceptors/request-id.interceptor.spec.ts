import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AUTH_API_URL } from 'ngx-login-client';
import uuid from 'uuid';
import { RequestIdInterceptor } from './request-id.interceptor';

describe('RequestIdInterceptor', () => {
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

  it('should add an X-Request-Id header', () => {
    httpClient.get(testUrl).subscribe(() => {});

    const req = httpMock.expectOne(testUrl);

    expect(req.request.headers.has('X-Request-Id'));
    expect(req.request.headers.get('X-Request-Id')).toBe(testUUID);
  });
});
