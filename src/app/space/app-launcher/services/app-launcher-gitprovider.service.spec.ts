import { TestBed } from '@angular/core/testing';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import {
  AuthHelperService, Config, GitHubDetails, HelperService, TokenProvider
} from 'ngx-forge';

import { FABRIC8_FORGE_API_URL } from 'app/shared/runtime-console/fabric8-ui-forge-api';
import { NewForgeConfig } from '../shared/new-forge.config';
import { AppLauncherGitproviderService } from './app-launcher-gitprovider.service';


function initTestBed() {
  TestBed.configureTestingModule({
    imports: [HttpModule],
    providers: [
        AppLauncherGitproviderService,
        AuthHelperService,
        HelperService,
        TokenProvider,
        { provide: Config, useClass: NewForgeConfig },
        { provide: FABRIC8_FORGE_API_URL, useValue: 'url-here' },
        {
            provide: XHRBackend, useClass: MockBackend
        }
    ]
  });
}

describe('Service: AppLauncherGitproviderService', () => {
  let helperService: HelperService;
  let appLauncherGitproviderService: AppLauncherGitproviderService;
  let mockService: MockBackend;
  let gitHubDetails = {
    authenticated: true,
    avatar: 'avatar-url',
    login: 'login',
    organizations: []
  } as GitHubDetails;
  let orgs = ['fabric-ui'];

  beforeEach(() => {
    initTestBed();
    appLauncherGitproviderService = TestBed.get(AppLauncherGitproviderService);
    mockService = TestBed.get(XHRBackend);
  });

  it('Get GitHubDetails', () => {
    mockService.connections.subscribe((connection: any) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: JSON.stringify(gitHubDetails),
            status: 200
          })
        ));
    });
    appLauncherGitproviderService.getGitHubDetails().subscribe((val) => {
        expect(val).toEqual(gitHubDetails);
    });
  });

  it('Get UserOrgs', () => {
    mockService.connections.subscribe((connection: any) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: JSON.stringify(orgs),
            status: 200
          })
        ));
    });
    appLauncherGitproviderService.getUserOrgs(gitHubDetails.login).subscribe((val) => {
        expect(val).toEqual(orgs);
    });
  });

  it('Check if GitHubRepo exists', () => {
    mockService.connections.subscribe((connection: any) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: JSON.stringify(true),
            status: 200
          })
        ));
    });
    appLauncherGitproviderService.isGitHubRepo('fabric-ui', 'test-repo').subscribe((val) => {
        expect(val).toBeTruthy();
    });
  });

});
