import { inject, TestBed } from '@angular/core/testing';
import {
  HttpModule,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import {
    Config,
    HelperService,
    Pipeline,
    TokenProvider
} from 'ngx-forge';
import {
    Observable,
    Subject
} from 'rxjs';

import { FABRIC8_FORGE_API_URL } from 'app/shared/runtime-console/fabric8-ui-forge-api';
import { NewForgeConfig } from '../shared/new-forge.config';
import { AppLauncherPipelineService } from './app-launcher-pipeline.service';


function initTestBed() {
  TestBed.configureTestingModule({
        imports: [
            HttpModule
        ],
        providers: [
            AppLauncherPipelineService,
            HelperService,
            TokenProvider,
            { provide: Config, useClass: NewForgeConfig },
            { provide: FABRIC8_FORGE_API_URL, useValue: 'url-here' },
            { provide: XHRBackend, useClass: MockBackend }
        ]
  });
}

function mockPipeline(): Pipeline[] {
    return <Pipeline[]> [{
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
    }];
}

describe('Service: AppLauncherPipelineService', () => {
  let helperService: HelperService;
  let appLauncherPipelineService: AppLauncherPipelineService;

  beforeEach(() => {
    initTestBed();
    appLauncherPipelineService = TestBed.get(AppLauncherPipelineService);
  });

  it('should return pipelines', () => {
    inject([AppLauncherPipelineService, XHRBackend], (service, mockBackend) => {
        mockBackend.connections.subscribe((connection) => {
            connection.mockRespond(new Response(new ResponseOptions({
                body: JSON.stringify(mockPipeline)
            })));
        });

        service.getMissions().subscribe(response => {
            let pipelines: Pipeline[] = response;
            expect(pipelines.length).toBe(2);
            expect(pipelines[0].id).toBe('maven-releaseandstage');
            expect(pipelines[0].name).toBe('Release and Stage');
            expect(pipelines[0].platform).toBe('maven');
            expect(pipelines[0].stages).toBeDefined();
            expect(pipelines[0].stages.length).toBe(2);
            expect(pipelines[0].suggested).toBe(true);
        });
    });
  });

});
