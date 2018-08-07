import {inject, TestBed} from '@angular/core/testing';
import {HttpModule, Response, ResponseOptions, XHRBackend} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

import {
  AuthHelperService, Config, HelperService, Summary, TokenProvider
} from 'ngx-launcher';

import {ContextService} from '../../../shared/context.service';
import {FABRIC8_FORGE_API_URL} from '../../../shared/runtime-console/fabric8-ui-forge-api';
import {NewForgeConfig} from '../shared/new-forge.config';
import {AppLauncherProjectSummaryService} from './app-launcher-project-summary.service';


function initTestBed() {
  TestBed.configureTestingModule({
    imports: [HttpModule],
    providers: [
      AppLauncherProjectSummaryService,
      AuthHelperService,
      HelperService,
      TokenProvider,
      {provide: ContextService, useValue: {}},
      {provide: Config, useClass: NewForgeConfig},
      {provide: FABRIC8_FORGE_API_URL, useValue: 'url-here'},
      {
        provide: XHRBackend, useClass: MockBackend
      }
    ]
  });
}

describe('Service: AppLauncherProjectSummaryService', () => {
  let appLauncherProjectSummaryService: AppLauncherProjectSummaryService;
  let mockService: MockBackend;

  let summaryData = {
    dependencyCheck: null,
    gitHubDetails: null,
    mission: null,
    organization: null,
    pipeline: null,
    runtime: null,
    targetEnvironment: null
  } as Summary;

  beforeEach(() => {
    initTestBed();
    appLauncherProjectSummaryService = TestBed.get(AppLauncherProjectSummaryService);
    mockService = TestBed.get(XHRBackend);
  });

  // FIXME presumable can't mock all the http interactions with one response
  xit('Should return uuid', (done: DoneFn) => {
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify({
            'uuid': 'e6daff35-5d93-4c38-965a-6a975cf80be1',
            'uuid_link': '/status/e6daff35-5d93-4c38-965a-6a975cf80be1'
          }),
          status: 200
        })
      ));

      appLauncherProjectSummaryService.setup(summaryData, 3).subscribe((val: any) => {
        expect(val).toBeDefined();
        expect(val.uuid).toEqual('e6daff35-5d93-4c38-965a-6a975cf80be1');
        done();
      });
    });
  });

});
