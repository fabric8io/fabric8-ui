import { TestBed } from '@angular/core/testing';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import {
  AuthHelperService, Config, GitHubDetails, HelperService, TokenProvider
} from 'ngx-launcher';

import { FABRIC8_FORGE_API_URL } from '../../../shared/runtime-console/fabric8-ui-forge-api';
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
      {provide: Config, useClass: NewForgeConfig},
      {provide: FABRIC8_FORGE_API_URL, useValue: 'url-here'},
      {
        provide: XHRBackend, useClass: MockBackend
      }
    ]
  });
}

describe('Service: AppLauncherGitproviderService', () => {

  let appLauncherGitproviderService: AppLauncherGitproviderService;
  let mockService: MockBackend;
  let gitHubDetails = {
    authenticated: true,
    avatar: 'avatar-url',
    login: 'login',
    organizations: []
  } as GitHubDetails;
  let orgs = ['fabric-ui'];
  let repos = ['fabric-ui', 'fabric-uxd'];

  beforeEach(() => {
    initTestBed();
    appLauncherGitproviderService = TestBed.get(AppLauncherGitproviderService);
    mockService = TestBed.get(XHRBackend);
  });

  // FIXME does two http calls so we can't return the same data for both cases
  xit('Get GitHubDetails', (done: DoneFn) => {
    mockService.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(gitHubDetails),
          status: 200
        })
      ));
    });

    appLauncherGitproviderService.getGitHubDetails().subscribe((val) => {
      expect(val).toEqual(gitHubDetails);
      done();
    });
  });

  it('Get UserOrgs', (done: DoneFn) => {
    mockService.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(orgs),
          status: 200
        })
      ));
    });
    appLauncherGitproviderService.getUserOrgs(gitHubDetails.login).subscribe((val) => {
      expect(val).toEqual(orgs);
      done();
    });
  });

  it('Check if GitHubRepo exists', (done: DoneFn) => {
    mockService.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(['fabric-ui/test-repo']),
          status: 200
        })
      ));
    });

    appLauncherGitproviderService.isGitHubRepo('fabric-ui', 'test-repo').subscribe((val) => {
      expect(val).toBeTruthy();
      done();
    });
  });

  it('Get gitHub repos for selected organisation', (done: DoneFn) => {
    mockService.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(repos),
          status: 200
        })
      ));
    });

    appLauncherGitproviderService.getGitHubRepoList(orgs[0]).subscribe((val) => {
      expect(val).toEqual(repos);
      done();
    });
  });

});
