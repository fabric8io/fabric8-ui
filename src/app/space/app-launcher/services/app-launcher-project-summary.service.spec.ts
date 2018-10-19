// import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
// import { TestBed } from '@angular/core/testing';
// import { Context } from 'ngx-fabric8-wit';
// import { AuthHelperService, Config, HelperService, Summary } from 'ngx-launcher';
// import { AUTH_API_URL, AuthenticationService } from 'ngx-login-client';
// import { Observable,  of as observableOf } from 'rxjs';
// import { createMock } from 'testing/mock';
// import { ContextService } from '../../../shared/context.service';
// import { context1, context2 } from '../../../shared/context.service.mock';
// import { FABRIC8_FORGE_API_URL } from '../../../shared/runtime-console/fabric8-ui-forge-api';
// import { NewForgeConfig } from '../shared/new-forge.config';
// import { AppLauncherProjectSummaryService } from './app-launcher-project-summary.service';

// describe('Service: AppLauncherProjectSummaryService', () => {
//   let service: AppLauncherProjectSummaryService;
//   let controller: HttpTestingController;

//   let summaryData = {
//     dependencyCheck: null,
//     gitHubDetails: {login: 'some-user'},
//     mission: null,
//     organization: null,
//     pipeline: null,
//     runtime: null,
//     targetEnvironment: null
//   } as Summary;

//   class mockContextService {
//     get current(): Observable<Context> { return observableOf(context1); }
//   }

//   beforeEach(() => {
//     const mockAuthenticationService: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
//     mockAuthenticationService.getToken.and.returnValue('mock-token');
//     const mockHelperService: jasmine.SpyObj<HelperService> = createMock(HelperService);
//     mockHelperService.getBackendUrl.and.returnValue('http://example.com/');
//     mockHelperService.getOrigin.and.returnValue('osio');

//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [
//         AppLauncherProjectSummaryService,
//         AuthHelperService,
//         { provide: HelperService, useValue: mockHelperService },
//         { provide: AuthenticationService, useValue: mockAuthenticationService },
//         { provide: ContextService, useClass: mockContextService },
//         { provide: Config, useClass: NewForgeConfig },
//         { provide: FABRIC8_FORGE_API_URL, useValue: 'http://example.com' },
//         { provide: AUTH_API_URL, useValue: 'http://auth.example.com' }
//       ]
//     });
//     service = TestBed.get(AppLauncherProjectSummaryService);
//     controller = TestBed.get(HttpTestingController);
//   });

//   it('Should return uuid', (done: DoneFn) => {
//     service.setup(summaryData, 3).subscribe((val: any) => {
//       expect(val).toBeDefined();
//       expect(val.uuid).toEqual('e6daff35-5d93-4c38-965a-6a975cf80be1');
//       done();
//     });

//     const req: TestRequest = controller.expectOne('http://example.com/osio/import');
//     expect(req.request.method).toBe('POST');
//     expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-token');
//     req.flush({
//       'uuid': 'e6daff35-5d93-4c38-965a-6a975cf80be1',
//       'uuid_link': '/status/e6daff35-5d93-4c38-965a-6a975cf80be1'
//     });
//   });

// });

