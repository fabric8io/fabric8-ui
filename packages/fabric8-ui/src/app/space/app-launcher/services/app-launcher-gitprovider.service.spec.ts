import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { Config, GitHubDetails, HelperService } from 'ngx-launcher';
import { AuthenticationService } from 'ngx-login-client';
import { createMock } from 'testing/mock';
import { FABRIC8_FORGE_API_URL } from '../../../shared/runtime-console/fabric8-ui-forge-api';
import { NewForgeConfig } from '../shared/new-forge.config';
import { AppLauncherGitproviderService } from './app-launcher-gitprovider.service';

import { ProviderService } from '../../../shared/account/provider.service';
import { FABRIC8_BUILD_TOOL_DETECTOR_API_URL } from '../../../shared/runtime-console/fabric8-ui-build-tool-detector-api';

describe('Service: AppLauncherGitproviderService', () => {
  let service: AppLauncherGitproviderService;
  let controller: HttpTestingController;
  const user = {
    login: 'some-user',
    avatarUrl: 'avatar-url',
  };
  const gitHubDetails = {
    authenticated: true,
    avatar: 'avatar-url',
    login: 'some-user',
    organizations: { 'fabric8-ui': 'fabric8-ui', 'some-user': undefined },
  } as GitHubDetails;
  const orgs = { 'fabric8-ui': 'fabric8-ui' };
  const repos = ['fabric8-ui', 'fabric-uxd'];
  const detectedTool = { 'build-tool-type': 'nodejs' };

  beforeEach(() => {
    const mockProviderService = jasmine.createSpy('ProviderService');
    const mockAuthenticationService: jasmine.SpyObj<AuthenticationService> = createMock(
      AuthenticationService,
    );
    mockAuthenticationService.getToken.and.returnValue('mock-token');
    const mockHelperService: jasmine.SpyObj<HelperService> = createMock(HelperService);
    mockHelperService.getBackendUrl.and.returnValue('http://example.com/');
    mockHelperService.getOrigin.and.returnValue('osio');
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AppLauncherGitproviderService,
        { provide: ProviderService, useValue: mockProviderService },
        { provide: HelperService, useValue: mockHelperService },
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: Config, useClass: NewForgeConfig },
        { provide: FABRIC8_FORGE_API_URL, useValue: 'http://example.com' },
        { provide: FABRIC8_BUILD_TOOL_DETECTOR_API_URL, useValue: 'http://example.com' },
      ],
    });
    service = TestBed.get(AppLauncherGitproviderService);
    controller = TestBed.get(HttpTestingController);
  });

  it('should get GitHubDetails', async((done: DoneFn) => {
    service.getGitHubDetails().subscribe((val: GitHubDetails) => {
      expect(val).toEqual(gitHubDetails);
      done();
    });

    const req1: TestRequest = controller.expectOne('http://example.com/services/git/user');
    expect(req1.request.method).toBe('GET');
    expect(req1.request.headers.get('Authorization')).toEqual('Bearer mock-token');
    req1.flush(user);
    const req2: TestRequest = controller.expectOne('http://example.com/services/git/organizations');
    expect(req2.request.method).toBe('GET');
    expect(req2.request.headers.get('Authorization')).toEqual('Bearer mock-token');
    req2.flush(orgs);
  }));

  it('should get user orgs', (done: DoneFn) => {
    service.getUserOrgs(user.login).subscribe((val) => {
      expect(val).toEqual(orgs);
      done();
    });

    const req: TestRequest = controller.expectOne('http://example.com/services/git/organizations');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-token');
    req.flush(orgs);
  });

  it('should check if GitHubRepo exists', (done: DoneFn) => {
    service.isGitHubRepo('fabric8-ui', 'test-repo').subscribe((val) => {
      expect(val).toBeTruthy();
      done();
    });
    const req: TestRequest = controller.expectOne(
      'http://example.com/services/git/repositories?organization=fabric8-ui',
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-token');
    req.flush(['fabric8-ui/test-repo']);
  });

  it('should get gitHub repos for selected organisation', (done: DoneFn) => {
    service.getGitHubRepoList('fabric8-ui').subscribe((val) => {
      expect(val).toEqual(repos);
      done();
    });

    const req: TestRequest = controller.expectOne(
      'http://example.com/services/git/repositories?organization=fabric8-ui',
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-token');
    req.flush(repos);
  });

  it('should detect the build tool', async((done: DoneFn) => {
    service
      .getDetectedBuildRuntime('https%3A%2F%2Fgithub.com%2Ffabric8-ui%2Ffabric8-ui')
      .subscribe((buildTool) => {
        expect(buildTool).toEqual(detectedTool);
        done();
      });
  }));

  it('should create correct build tool detector api url', () => {
    const correctUrl = 'https://www.example.com/api/detect/build/';
    const apiUrl = 'https://www.example.com';
    const url = service.constructApiUrl(apiUrl, 'api/detect/build/');
    expect(url).toBe(correctUrl);

    const apiUrl1 = 'https://www.example.com/';
    const url1 = service.constructApiUrl(apiUrl1, 'api/detect/build/');
    expect(url1).toBe(correctUrl);
  });
});
