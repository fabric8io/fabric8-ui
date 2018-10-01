import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
    Config,
    HelperService,
    URLProvider
} from 'ngx-launcher';
import { AuthenticationService } from 'ngx-login-client';
import { createMock } from 'testing/mock';
import { FABRIC8_FORGE_API_URL } from '../../../shared/runtime-console/fabric8-ui-forge-api';
import { NewForgeConfig } from '../shared/new-forge.config';
import { AppLauncherDependencyEditorService } from './app-launcher-dependency-editor.service';

describe('Service: AppLauncherDependencyCheckService', () => {
  let service: AppLauncherDependencyEditorService;
  let controller: HttpTestingController;
  let depSample = {
    '_resolved': [
        {
            'package': 'io.vertx:vertx-core',
            'version': '3.5.0'
        },
        {
            'package': 'io.vertx:vertx-unit',
            'version': '3.5.0'
        }
    ],
    'ecosystem': 'maven',
    'request_id': '602af58786db4539b8c23f398c79f281'
};

  beforeEach(() => {
    const mockAuthenticationService: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
    mockAuthenticationService.getToken.and.returnValue('mock-token');
    const mockURLProvider: jasmine.SpyObj<URLProvider> = createMock(URLProvider);
    mockURLProvider.getRecommenderAPIUrl.and.returnValue('http://example.com');
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
          AppLauncherDependencyEditorService,
          HelperService,
          { provide: AuthenticationService, useValue: mockAuthenticationService },
          { provide: URLProvider, useValue: mockURLProvider },
          { provide: Config, useClass: NewForgeConfig },
          { provide: FABRIC8_FORGE_API_URL, useValue: 'http://example.com' }
      ]
    });
    service = TestBed.get(AppLauncherDependencyEditorService);
    controller = TestBed.get(HttpTestingController);
  });

  it('should get core dependencies', (done: DoneFn) => {
    service.getCoreDependencies('vertx').subscribe((val) => {
        expect(val).toEqual(depSample);
        done();
    });

    const req: TestRequest = controller.expectOne('http://example.com/api/v1/get-core-dependencies/vertx');
    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-token');
    req.flush(depSample);
  });

});
