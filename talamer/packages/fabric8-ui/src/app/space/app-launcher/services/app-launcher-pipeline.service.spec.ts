import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  Config,
  HelperService,
  Pipeline
} from 'ngx-launcher';
import { AuthenticationService } from 'ngx-login-client';
import { createMock } from 'testing/mock';
import { FABRIC8_FORGE_API_URL } from '../../../shared/runtime-console/fabric8-ui-forge-api';
import { NewForgeConfig } from '../shared/new-forge.config';
import { AppLauncherPipelineService } from './app-launcher-pipeline.service';

const mockPipelines: Pipeline[] = [
  {
    id: 'maven-releaseandstage',
    platform: 'maven',
    name: 'Release and Stage',
    stages: [
      {
        name: 'Build Release',
        description: 'creates a new version then builds and deploys the project into the maven repository'
      },
      {
        name: 'Rollout to Stage',
        description: 'stages the new version into the Stage environment'
      }
    ],
    suggested: true
  },
  {
    id: 'node-releaseandstage',
    platform: 'node',
    name: 'Release and Stage',
    stages: [
      {
        name: 'Build Release',
        description: 'creates a new version then builds and deploys the project into the maven repository'
      },
      {
        name: 'Rollout to Stage',
        description: 'stages the new version into the Stage environment'
      }
    ],
    suggested: false
  }];

describe('Service: AppLauncherPipelineService', () => {
  let service: AppLauncherPipelineService;
  let controller: HttpTestingController;

  beforeEach(() => {
    const mockAuthenticationService: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
    mockAuthenticationService.getToken.and.returnValue('mock-token');
    const mockHelperService: jasmine.SpyObj<HelperService> = createMock(HelperService);
    mockHelperService.getBackendUrl.and.returnValue('http://example.com/');
    mockHelperService.getOrigin.and.returnValue('osio');
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AppLauncherPipelineService,
        { provide: HelperService, useValue: mockHelperService },
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: Config, useClass: NewForgeConfig },
        { provide: FABRIC8_FORGE_API_URL, useValue: 'url-here' }
      ]
    });
    service = TestBed.get(AppLauncherPipelineService);
    controller = TestBed.get(HttpTestingController);
  });

  // FIXME https://github.com/openshiftio/openshift.io/issues/4140
  xit('should return all pipelines when no platform specified', (done: DoneFn) => {
    service.getPipelines().subscribe(pipelines => {
      expect(pipelines.length).toBe(2);
      expect(pipelines).toBe(mockPipelines);
      done();
    });

    const req: TestRequest = controller.expectOne('http://example.com/services/jenkins/pipelines');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-token');
    req.flush(mockPipelines);
  });

  it('should return empty pipeline collection when response is empty', (done: DoneFn) => {
    service.getPipelines().subscribe(pipelines => {
      expect(pipelines.length).toBe(0);
      done();
    });
    const req: TestRequest = controller.expectOne('http://example.com/services/jenkins/pipelines');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-token');
    req.flush([]);
  });

});
