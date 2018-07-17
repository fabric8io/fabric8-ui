import { inject, TestBed } from '@angular/core/testing';
import {
  HttpModule,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import {
  Catalog,
  Config,
  HelperService,
  TokenProvider
} from 'ngx-launcher';

import { FABRIC8_FORGE_API_URL } from '../../../shared/runtime-console/fabric8-ui-forge-api';
import { NewForgeConfig } from '../shared/new-forge.config';
import { AppLauncherMissionRuntimeService } from './app-launcher-mission-runtime.service';


function initTestBed() {
  TestBed.configureTestingModule({
    imports: [
      HttpModule
    ],
    providers: [
      AppLauncherMissionRuntimeService,
      HelperService,
      TokenProvider,
      { provide: Config, useClass: NewForgeConfig },
      { provide: FABRIC8_FORGE_API_URL, useValue: 'url-here' },
      { provide: XHRBackend, useClass: MockBackend }
    ]
  });
}

function fakeCatlog(): Catalog {
  let catalog: Catalog = {
    missions: [{
      id: 'crud',
      name: 'CRUD',
      description: 'nice crud thing',
      metadata: {
        level: 'foundational'
      }
    },
    {
      id: 'circuit-breaker',
      name: 'Circuit Breaker',
      description: 'nice circuit to break'
    }],
    runtimes: [{
      id: 'vert.x',
      name: 'Eclipse Vert.x',
      icon: "data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 280'%3E%3Cpath fill='%23022B37' d='M107 170.8L67.7 72H46.9L100 204h13.9L167 72h-20.4zm64 33.2h80v-20h-61v-37h60v-19h-60V91h61V72h-80zm180.1-90.7c0-21-14.4-42.3-43.1-42.3h-48v133h19V91h29.1c16.1 0 24 11.1 24 22.4 0 11.5-7.9 22.6-24 22.6H286v9.6l48 58.4h24.7L317 154c22.6-4 34.1-22 34.1-40.7m56.4 90.7v-1c0-6 1.7-11.7 4.5-16.6V91h39V71h-99v20h41v113h14.5z'/%3E%3Cpath fill='%23623C94' d='M458 203c0-9.9-8.1-18-18-18s-18 8.1-18 18 8.1 18 18 18 18-8.1 18-18M577.4 72h-23.2l-27.5 37.8L499.1 72h-40.4c12.1 16 33.6 46.8 47.8 66.3l-37 50.9c2 4.2 3.1 8.9 3.1 13.8v1H499l95.2-132h-16.8zm-19.7 81.5l-20.1 27.9 16.5 22.6h40.2c-9.6-13.7-24-33.3-36.6-50.5z'/%3E%3C/svg%3E",
      metadata: {
        pipelinePlatform: 'maven'
      },
      versions: [
        {
          'id': 'redhat',
          'name': '3.5.1.redhat-003 (RHOAR)'
        }
      ]
    }],
    boosters: [{
        metadata: {
          app: {
            osio: {
              enabled: true
            }
          }
        },
        mission: 'health-check',
        name: 'WildFly Swarm - Health Checks',
        description: 'Demonstrates Health Checks in Wildfly Swarm',
        runtime: 'wildfly-swarm',
        version: 'community'
      }
    ]
  };

  return catalog;
}

describe('Service: AppLauncherMissionRuntimeService', () => {
  let helperService: HelperService;
  let appLauncherMissionRuntimeService: AppLauncherMissionRuntimeService;

  beforeEach(() => {
    initTestBed();
    appLauncherMissionRuntimeService = TestBed.get(AppLauncherMissionRuntimeService);
  });

  it('should return catalog', () => {
    inject([AppLauncherMissionRuntimeService, XHRBackend], (service, mockBackend) => {
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(fakeCatlog)
        })));
      });

      service.getMissions().subscribe(response => {
        let catalog: Catalog = response;
        expect(catalog.missions[0].id).toBe('crud');
        expect(catalog.missions[0].name).toBe('CRUD');
      });
    });
  });
});
