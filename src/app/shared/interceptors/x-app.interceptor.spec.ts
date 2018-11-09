import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FABRIC8_FORGE_API_URL } from '../runtime-console/fabric8-ui-forge-api';
import { XAppInterceptor } from './x-app.interceptor';

describe('XAppInterceptor', () => {
  const forgeTestUrl: string = 'http://forge.example.com/test';

  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: FABRIC8_FORGE_API_URL, useValue: 'http://forge.example.com' },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: XAppInterceptor,
          multi: true
        }
      ]
    });
    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add an X-App header to forge URL', () => {
    httpClient.get(forgeTestUrl).subscribe(() => {});

    const req = httpMock.expectOne(forgeTestUrl);

    expect(req.request.headers.has('X-App')).toBeTruthy();
    expect(req.request.headers.get('X-App')).toBe('OSIO');
  });

  it('should not add an X-App header if URL is not forge or recommender', () => {
    httpClient.get('http://example.com/test').subscribe(() => {});

    const req = httpMock.expectOne('http://example.com/test');

    expect(req.request.headers.has('X-App')).toBeFalsy();
  });
});
