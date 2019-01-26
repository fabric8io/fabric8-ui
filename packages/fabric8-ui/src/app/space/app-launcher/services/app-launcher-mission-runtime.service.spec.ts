import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Catalog, Config, HelperService } from 'ngx-launcher';
import { AuthenticationService } from 'ngx-login-client';
import { createMock } from 'testing/mock';
import { FeatureTogglesService } from 'ngx-feature-flag';
import { of } from 'rxjs';
import { FABRIC8_FORGE_API_URL } from '../../../shared/runtime-console/fabric8-ui-forge-api';
import { NewForgeConfig } from '../shared/new-forge.config';
import { AppLauncherMissionRuntimeService } from './app-launcher-mission-runtime.service';

const fakeCatalog: Catalog = {
  missions: [
    {
      id: 'crud',
      name: 'CRUD',
      description: 'nice crud thing',
      metadata: {
        level: 'foundational',
      },
    },
    {
      id: 'circuit-breaker',
      name: 'Circuit Breaker',
      description: 'nice circuit to break',
    },
  ],
  runtimes: [
    {
      id: 'vert.x',
      name: 'Eclipse Vert.x',
      icon:
        "data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 280'%3E%3Cpath fill='%23022B37' d='M107 170.8L67.7 72H46.9L100 204h13.9L167 72h-20.4zm64 33.2h80v-20h-61v-37h60v-19h-60V91h61V72h-80zm180.1-90.7c0-21-14.4-42.3-43.1-42.3h-48v133h19V91h29.1c16.1 0 24 11.1 24 22.4 0 11.5-7.9 22.6-24 22.6H286v9.6l48 58.4h24.7L317 154c22.6-4 34.1-22 34.1-40.7m56.4 90.7v-1c0-6 1.7-11.7 4.5-16.6V91h39V71h-99v20h41v113h14.5z'/%3E%3Cpath fill='%23623C94' d='M458 203c0-9.9-8.1-18-18-18s-18 8.1-18 18 8.1 18 18 18 18-8.1 18-18M577.4 72h-23.2l-27.5 37.8L499.1 72h-40.4c12.1 16 33.6 46.8 47.8 66.3l-37 50.9c2 4.2 3.1 8.9 3.1 13.8v1H499l95.2-132h-16.8zm-19.7 81.5l-20.1 27.9 16.5 22.6h40.2c-9.6-13.7-24-33.3-36.6-50.5z'/%3E%3C/svg%3E",
      metadata: {
        pipelinePlatform: 'maven',
      },
      versions: [
        {
          id: 'redhat',
          name: '3.5.1.redhat-003 (RHOAR)',
        },
      ],
    },
  ],
  boosters: [
    {
      metadata: {
        app: {
          osio: {
            enabled: true,
          },
        },
      },
      mission: 'health-check',
      name: 'WildFly Swarm - Health Checks',
      description: 'Demonstrates Health Checks in Wildfly Swarm',
      runtime: 'wildfly-swarm',
      version: 'community',
    },
  ],
};

const fakeNodeCatalog: Catalog = {
  missions: [
    {
      id: 'crud',
      name: 'CRUD',
      description: 'nice crud thing',
      metadata: {
        level: 'foundational',
      },
    },
    {
      id: 'circuit-breaker',
      name: 'Circuit Breaker',
      description: 'nice circuit to break',
    },
  ],
  runtimes: [
    {
      id: 'vert.x',
      name: 'Eclipse Vert.x',
      icon:
        "data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 280'%3E%3Cpath fill='%23022B37' d='M107 170.8L67.7 72H46.9L100 204h13.9L167 72h-20.4zm64 33.2h80v-20h-61v-37h60v-19h-60V91h61V72h-80zm180.1-90.7c0-21-14.4-42.3-43.1-42.3h-48v133h19V91h29.1c16.1 0 24 11.1 24 22.4 0 11.5-7.9 22.6-24 22.6H286v9.6l48 58.4h24.7L317 154c22.6-4 34.1-22 34.1-40.7m56.4 90.7v-1c0-6 1.7-11.7 4.5-16.6V91h39V71h-99v20h41v113h14.5z'/%3E%3Cpath fill='%23623C94' d='M458 203c0-9.9-8.1-18-18-18s-18 8.1-18 18 8.1 18 18 18 18-8.1 18-18M577.4 72h-23.2l-27.5 37.8L499.1 72h-40.4c12.1 16 33.6 46.8 47.8 66.3l-37 50.9c2 4.2 3.1 8.9 3.1 13.8v1H499l95.2-132h-16.8zm-19.7 81.5l-20.1 27.9 16.5 22.6h40.2c-9.6-13.7-24-33.3-36.6-50.5z'/%3E%3C/svg%3E",
      metadata: {
        pipelinePlatform: 'maven',
      },
      versions: [
        {
          id: 'redhat',
          name: '3.5.1.redhat-003 (RHOAR)',
        },
      ],
    },
    {
      description:
        'A JavaScript runtime built on Chromes V8 JavaScript engine, using an event-driven, non-blocking I/O model for lightweight efficiency.',
      id: 'nodejs',
      metadata: {
        pipelinePlatform: 'node',
      },
      icon: '"data:image/svg+xml;charset=utf8,%3Csvg',
      name: 'Node.js',
      versions: [
        {
          id: 'v10-community',
          name: '10.x (community)',
        },
      ],
    },
  ],
  boosters: [
    {
      metadata: {
        app: {
          osio: {
            enabled: true,
          },
        },
      },
      mission: 'health-check',
      name: 'WildFly Swarm - Health Checks',
      description: 'Demonstrates Health Checks in Wildfly Swarm',
      runtime: 'wildfly-swarm',
      version: 'community',
    },
    {
      description: 'Run a Node.js HTTP application',
      metadata: {
        app: {
          osio: {
            enabled: true,
          },
        },
      },
      mission: 'rest-http',
      name: 'Node.js - HTTP',
      runtime: 'nodejs',
      version: 'v10-community',
    },
  ],
};

const fakeGoLangCatalog: Catalog = {
  missions: [
    {
      id: 'crud',
      name: 'CRUD',
      description: 'nice crud thing',
      metadata: {
        level: 'foundational',
      },
    },
    {
      id: 'circuit-breaker',
      name: 'Circuit Breaker',
      description: 'nice circuit to break',
    },
  ],
  runtimes: [
    {
      id: 'vert.x',
      name: 'Eclipse Vert.x',
      icon:
        "data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 280'%3E%3Cpath fill='%23022B37' d='M107 170.8L67.7 72H46.9L100 204h13.9L167 72h-20.4zm64 33.2h80v-20h-61v-37h60v-19h-60V91h61V72h-80zm180.1-90.7c0-21-14.4-42.3-43.1-42.3h-48v133h19V91h29.1c16.1 0 24 11.1 24 22.4 0 11.5-7.9 22.6-24 22.6H286v9.6l48 58.4h24.7L317 154c22.6-4 34.1-22 34.1-40.7m56.4 90.7v-1c0-6 1.7-11.7 4.5-16.6V91h39V71h-99v20h41v113h14.5z'/%3E%3Cpath fill='%23623C94' d='M458 203c0-9.9-8.1-18-18-18s-18 8.1-18 18 8.1 18 18 18 18-8.1 18-18M577.4 72h-23.2l-27.5 37.8L499.1 72h-40.4c12.1 16 33.6 46.8 47.8 66.3l-37 50.9c2 4.2 3.1 8.9 3.1 13.8v1H499l95.2-132h-16.8zm-19.7 81.5l-20.1 27.9 16.5 22.6h40.2c-9.6-13.7-24-33.3-36.6-50.5z'/%3E%3C/svg%3E",
      metadata: {
        pipelinePlatform: 'maven',
      },
      versions: [
        {
          id: 'redhat',
          name: '3.5.1.redhat-003 (RHOAR)',
        },
      ],
    },
    {
      description:
        'A JavaScript runtime built on Chromes V8 JavaScript engine, using an event-driven, non-blocking I/O model for lightweight efficiency.',
      id: 'nodejs',
      metadata: {
        pipelinePlatform: 'node',
      },
      icon: '"data:image/svg+xml;charset=utf8,%3Csvg',
      name: 'Node.js',
      versions: [
        {
          id: 'v10-community',
          name: '10.x (community)',
        },
      ],
    },
    {
      id: 'golang',
      name: 'Golang',
      icon: 'data:image/svg+xml;charset=utf8,%3Csvg',
      description: 'The Golang runtime enables you to deploy GoLang applications on OpenShift.',
      metadata: {
        pipelinePlatform: 'golang',
      },
      versions: [
        {
          id: 'redhat',
          name: 'Red Hat Golang',
        },
      ],
    },
  ],
  boosters: [
    {
      metadata: {
        app: {
          osio: {
            enabled: true,
          },
        },
      },
      mission: 'health-check',
      name: 'WildFly Swarm - Health Checks',
      description: 'Demonstrates Health Checks in Wildfly Swarm',
      runtime: 'wildfly-swarm',
      version: 'community',
    },
    {
      description: 'Run a Node.js HTTP application',
      metadata: {
        app: {
          osio: {
            enabled: true,
          },
        },
      },
      mission: 'rest-http',
      name: 'Node.js - HTTP',
      runtime: 'nodejs',
      version: 'v10-community',
    },
    {
      metadata: {
        app: {
          osio: {
            enabled: true,
          },
        },
      },
      mission: 'health-check',
      name: 'Red Hat Golang - Health Check Example',
      description: 'Test',
      runtime: 'golang',
      source: {
        git: {
          url: 'https://github.com/golang-starters/golang-health-check',
          ref: 'master',
        },
      },
      version: 'redhat',
    },
  ],
};

describe('Service: AppLauncherMissionRuntimeService', () => {
  let service: AppLauncherMissionRuntimeService;
  let controller: HttpTestingController;
  let mockFeatureTogglesService: jasmine.SpyObj<FeatureTogglesService>;

  beforeEach(() => {
    const mockAuthenticationService: jasmine.SpyObj<AuthenticationService> = createMock(
      AuthenticationService,
    );
    mockAuthenticationService.getToken.and.returnValue('mock-token');
    const mockHelperService: jasmine.SpyObj<HelperService> = createMock(HelperService);
    mockHelperService.getBackendUrl.and.returnValue('http://example.com/');
    mockHelperService.getOrigin.and.returnValue('osio');
    mockFeatureTogglesService = jasmine.createSpyObj('FeatureTogglesService', [
      'isFeatureUserEnabled',
    ]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AppLauncherMissionRuntimeService,
        {
          provide: FeatureTogglesService,
          useValue: mockFeatureTogglesService,
        },
        { provide: HelperService, useValue: mockHelperService },
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: Config, useClass: NewForgeConfig },
        { provide: FABRIC8_FORGE_API_URL, useValue: 'url-here' },
      ],
    });
    service = TestBed.get(AppLauncherMissionRuntimeService);
    controller = TestBed.get(HttpTestingController);
  });

  it('should return catalog', (done: DoneFn) => {
    mockFeatureTogglesService.isFeatureUserEnabled.and.returnValue(of(false));
    service.getCatalog().subscribe((catalog: Catalog) => {
      expect(catalog).toBe(fakeCatalog);
      done();
    });

    const req: TestRequest = controller.expectOne('http://example.com/booster-catalog/');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-token');
    req.flush(fakeCatalog);
  });

  it('should not return node booster if user is not selected experimental feature flag', (done: DoneFn) => {
    mockFeatureTogglesService.isFeatureUserEnabled.and.returnValue(of(true));
    service.getCatalog().subscribe((catalog: Catalog) => {
      expect(catalog).toBe(fakeNodeCatalog);
      done();
    });

    const req: TestRequest = controller.expectOne('http://example.com/booster-catalog/');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-token');
    req.flush(fakeNodeCatalog);
  });

  it('should not return GoLang booster if user is not selected experimental feature flag', (done: DoneFn) => {
    mockFeatureTogglesService.isFeatureUserEnabled.and.returnValue(of(true));
    service.getCatalog().subscribe((catalog: Catalog) => {
      expect(catalog).toBe(fakeGoLangCatalog);
      done();
    });

    const req: TestRequest = controller.expectOne('http://example.com/booster-catalog/');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-token');
    req.flush(fakeGoLangCatalog);
  });
});
