import { TestBed } from '@angular/core/testing';
import { Headers, HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs';

import { GitHubRepoCommit } from 'app/create/codebases/services/github';
import { GitHubService } from './github.service';
import { ContextsMock, expectedGitHubRepo, expectedGitHubRepoCommit, expectedGitHubRepoDetails, expectedGitHubRepoLicense } from './github.service.mock';


function initTestBed(mockAuthService) {
  TestBed.configureTestingModule({
    imports: [HttpModule],
    providers: [
      {
        provide: Contexts, useClass: ContextsMock
      },
      {
        provide: XHRBackend, useClass: MockBackend
      },
      {
        provide: AuthenticationService,
        useValue: mockAuthService
      },
      GitHubService
    ]
  });
}

describe('Github: GitHubService', () => {
  let mockContexts: any;
  let mockAuthService: any;
  let mockService: MockBackend;
  let ghService: GitHubService;

  beforeEach(() => {
    mockContexts = jasmine.createSpy('Contexts');
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken']);
    initTestBed(mockAuthService);
    ghService = TestBed.get(GitHubService);
    mockService = TestBed.get(XHRBackend);
    const fakeHeaderObservable = Observable.of({
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': 'token 51XXXX58ec9f0d0c4ee71aXXXXa48e6619efXXXX'
    });
    spyOn(ghService, 'getHeaders').and.returnValue(fakeHeaderObservable);
  });

  afterEach(() => {
    ghService.clearCache();
  });

  it('Get repo commit status by URL and sha', () => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedGitHubRepoCommit),
          status: 200
        })
      ));
    });
    // when
    ghService.getRepoCommitStatusByUrl('https://github.com/fabric8-services/fabric8-wit.git', '225368a414f88bd3c45fd686496a924a15ef81XX').subscribe((data: any) => {
      // then
      expect(data.sha).toEqual(expectedGitHubRepoCommit.sha);
    });
  });

  it('Get repo commit status by URL and sha in error', () => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });
    // when
    ghService.getRepoCommitStatusByUrl('https://github.com/fabric8-services/fabric8-wit.git', '225368a414f88bd3c45fd686496a924a15ef81YY').subscribe((data: any) => {
      fail('Get repo commit status by URL and sha in error');
    }, //then
      error => expect(error).toEqual('some error'));
  });

  it('Get repo commit status by URL and sha with cached value', () => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedGitHubRepoCommit),
          status: 200
        })
      ));
    });
    // when
    ghService.getRepoCommitStatusByUrl('https://github.com/fabric8-services/fabric8-wit.git', '225368a414f88bd3c45fd686496a924a15ef81b0').subscribe((data: any) => {
      // then
      expect(data.sha).toEqual(expectedGitHubRepoCommit.sha);
      let ghService = TestBed.get(GitHubService);
      let cachedValue = ghService.getCache('https://api.github.com/repos/fabric8-services/fabric8-wit/commits/225368a414f88bd3c45fd686496a924a15ef81b0');
      expect(cachedValue !== undefined).toBeTruthy();
    });

    // given 2nd call in error
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });

    // when
    ghService.getRepoCommitStatusByUrl('https://github.com/fabric8-services/fabric8-wit.git', '225368a414f88bd3c45fd686496a924a15ef81b0').subscribe((data: any) => {
      // then value cached
      expect(data.sha).toEqual(expectedGitHubRepoCommit.sha);
      let ghService = TestBed.get(GitHubService);
      let cachedValue = ghService.getCache('https://api.github.com/repos/fabric8-services/fabric8-wit/commits/225368a414f88bd3c45fd686496a924a15ef81b0');
      expect(cachedValue !== undefined).toBeTruthy();
    });
  });

  it('Get repo details by full name', () => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedGitHubRepoDetails),
          status: 200
        })
      ));
    });
    // when
    ghService.getRepoDetailsByFullName('fabric8-services/fabric8-wit').subscribe((data: any) => {
      // then
      expect(data.id).toEqual(expectedGitHubRepoDetails.id);
    });
  });

  it('Get repo details by full name in error', () => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });
    // when
    ghService.getRepoDetailsByFullName('fabric8-services/fabric8-wit').subscribe((data: any) => {
      fail('Get repo details by full name in error');
    }, //then
      error => expect(error).toEqual('some error'));
  });

  it('Get repo details by full name cached', () => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedGitHubRepoDetails),
          status: 200
        })
      ));
    });
    // when
    ghService.getRepoDetailsByFullName('fabric8-services/fabric8-wit').subscribe((data: any) => {
      // then
      expect(data.id).toEqual(expectedGitHubRepoDetails.id);
    });

    // given 2nd call in error
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });

    // when
    ghService.getRepoDetailsByFullName('fabric8-services/fabric8-wit').subscribe((data: any) => {
      // then value cached
      expect(data.id).toEqual(expectedGitHubRepoDetails.id);
      let ghService = TestBed.get(GitHubService);
      let cachedValue = ghService.getCache('https://api.github.com/repos/fabric8-services/fabric8-wit');
      expect(cachedValue !== undefined).toBeTruthy();
    });
  });

  it('Get repo details by URL', () => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedGitHubRepoDetails),
          status: 200
        })
      ));
    });
    // when
    ghService.getRepoDetailsByUrl('https://github.com/fabric8-services/fabric8-wit').subscribe((data: any) => {
      // then
      expect(data.full_name).toEqual(expectedGitHubRepoDetails.full_name);
    });
  });

  it('Get GitHub repo last commit for given URL', () => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedGitHubRepoCommit),
          status: 200
        })
      ));
    });
    // when
    ghService.getRepoLastCommitByUrl('https://github.com/fabric8-services/fabric8-wit.git').subscribe((data: any) => {
      // then
      expect(data.sha).toEqual(expectedGitHubRepoCommit.sha);
    });
  });

  it('Get GitHub repo last commit for given URL in error', () => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });
    // when
    ghService.getRepoLastCommitByUrl('https://github.com/fabric8-services/fabric8-wit.git').subscribe((data: any) => {
      fail('Get GitHub repo last commit for given URL in error');
    }, //then
      error => expect(error).toEqual('some error'));
  });

  it('Get GitHub repo last commit for given URL cached', () => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedGitHubRepoCommit),
          status: 200
        })
      ));
    });
    // when
    ghService.getRepoLastCommitByUrl('https://github.com/fabric8-services/fabric8-wit.git').subscribe((data: any) => {
      // then
      expect(data.sha).toEqual(expectedGitHubRepoCommit.sha);
    });

    // given 2nd call in error
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });

    // when
    ghService.getRepoLastCommitByUrl('https://github.com/fabric8-services/fabric8-wit.git').subscribe((data: any) => {
      // then value cached
      expect(data.sha).toEqual(expectedGitHubRepoCommit.sha);
      let ghService = TestBed.get(GitHubService);
      let cachedValue = ghService.getCache('https://api.github.com/repos/fabric8-services/fabric8-wit/git/refs/heads/master');
      expect(cachedValue !== undefined).toBeTruthy();
    });
  });

  it('Get GitHub repo license for given full name', () => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedGitHubRepoLicense),
          status: 200
        })
      ));
    });
    // when
    ghService.getRepoLicenseByName('fabric8-services/fabric8-wit').subscribe((data: any) => {
      // then
      expect(data.sha).toEqual(expectedGitHubRepoLicense.sha);
    });
  });

  it('Get GitHub repo license for given full name in error', () => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });
    // when
    ghService.getRepoLicenseByName('fabric8-services/fabric8-wit').subscribe((data: any) => {
      fail('Get GitHub repo license for given full name in error');
    }, //then
      error => expect(error).toEqual('some error'));
  });

  it('Get GitHub repo license for given full name cached', () => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedGitHubRepoLicense),
          status: 200
        })
      ));
    });
    // when
    ghService.getRepoLicenseByName('fabric8-services/fabric8-wit').subscribe((data: any) => {
      // then
      expect(data.sha).toEqual(expectedGitHubRepoLicense.sha);
    });

    // given 2nd call in error
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });

    // when
    ghService.getRepoLicenseByName('fabric8-services/fabric8-wit').subscribe((data: any) => {
      // then value cached
      expect(data.sha).toEqual(expectedGitHubRepoLicense.sha);
      let ghService = TestBed.get(GitHubService);
      let cachedValue = ghService.getCache('https://api.github.com/repos/fabric8-services/fabric8-wit/license');
      expect(cachedValue !== undefined).toBeTruthy();
    });
  });

  it('Get GitHub repo license for given URL', () => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedGitHubRepoLicense),
          status: 200
        })
      ));
    });
    // when
    ghService.getRepoLicenseByUrl('https://github.com/fabric8-services/fabric8-wit.git').subscribe((data: any) => {
      // then
      expect(data.sha).toEqual(expectedGitHubRepoLicense.sha);
    });
  });

  //////

  it('Get GitHub repos associated with given user name', () => {
    // given
    const repos = [expectedGitHubRepo];
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(repos),
          status: 200
        })
      ));
    });
    // when
    ghService.getUserRepos('me').subscribe((data: any) => {
      // then
      expect(data[0].full_name).toEqual(repos[0].full_name);
    });
  });

  it('Get GitHub repos associated with given user name in error', () => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });
    // when
    ghService.getUserRepos('me').subscribe((data: any) => {
      fail('Get GitHub repos associated with given user name in error');
    }, //then
      error => expect(error).toEqual('some error'));
  });

  it('Get GitHub repos associated with given user name cached', () => {
    // given
    const repos = [expectedGitHubRepo];
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(repos),
          status: 200
        })
      ));
    });
    // when
    ghService.getUserRepos('me').subscribe((data: any) => {
      // then
      expect(data[0].full_name).toEqual(repos[0].full_name);
    });

    // given 2nd call in error
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });

    // when
    ghService.getUserRepos('me').subscribe((data: any) => {
      // then value cached
      expect(data[0].full_name).toEqual(repos[0].full_name);
      let ghService = TestBed.get(GitHubService);
      let cachedValue = ghService.getCache('https://api.github.com/users/me/repos');
      expect(cachedValue !== undefined).toBeTruthy();
    });
  });
});


describe('Github: GitHubService', () => {
  let mockContexts: any;
  let mockAuthService: any;
  let mockService: MockBackend;
  let ghService: GitHubService;

  beforeEach(() => {
    mockContexts = jasmine.createSpy('Contexts');
    mockAuthService = jasmine.createSpy('AuthenticationService');
    mockAuthService.gitHubToken = Observable.of('XXX');
    initTestBed(mockAuthService);
    ghService = TestBed.get(GitHubService);
    mockService = TestBed.get(XHRBackend);
  });

  it('Get GiHub headers for given user name', () => {
    // given
    const expectedHeaders = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': 'token XXX'
    });
    // when
    ghService.getHeaders().subscribe((data: Headers) => {
      // then
      expect(data.keys()).toEqual(expectedHeaders.keys());
      expect(data.values()).toEqual(expectedHeaders.values());
    });
  });
});
