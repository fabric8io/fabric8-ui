import { HttpHeaders } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs';

import {
  GitHubRepo,
  GitHubRepoCommit,
  GitHubRepoDetails,
  GitHubRepoLicense
} from './github';
import { GitHubService } from './github.service';
import { expectedGitHubRepo, expectedGitHubRepoCommit, expectedGitHubRepoDetails, expectedGitHubRepoLicense } from './github.service.mock';


function initTestBed(mockAuthService) {
  TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [
      {
        provide: AuthenticationService,
        useValue: mockAuthService
      },
      GitHubService
    ]
  });
}

describe('Github: GitHubService', () => {
  let mockAuthService: any;
  let controller: HttpTestingController;
  let ghService: GitHubService;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken']);
    initTestBed(mockAuthService);
    ghService = TestBed.get(GitHubService);
    controller = TestBed.get(HttpTestingController);
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

  it('Get repo commit status by URL and sha', (done: DoneFn) => {
    ghService
      .getRepoCommitStatusByUrl('https://github.com/fabric8-services/fabric8-wit.git', '225368a414f88bd3c45fd686496a924a15ef81XX')
      .first()
      .subscribe((data: any) => {
        expect(data.sha).toEqual(expectedGitHubRepoCommit.sha);
        controller.verify();
        done();
      });
    controller.expectOne('https://api.github.com/repos/fabric8-services/fabric8-wit/commits/225368a414f88bd3c45fd686496a924a15ef81XX').flush(expectedGitHubRepoCommit);
  });

  it('Get repo commit status by URL and sha in error', (done: DoneFn) => {
    ghService
      .getRepoCommitStatusByUrl('https://github.com/fabric8-services/fabric8-wit.git', '225368a414f88bd3c45fd686496a924a15ef81YY')
      .first()
      .subscribe(
        () => {
          done.fail('Get repo commit status by URL and sha in error');
        },
        error => {
          expect(error).toEqual('Http failure response for https://api.github.com/repos/fabric8-services/fabric8-wit/commits/225368a414f88bd3c45fd686496a924a15ef81YY: 0 ');
          controller.verify();
          done();
        });
    controller.expectOne('https://api.github.com/repos/fabric8-services/fabric8-wit/commits/225368a414f88bd3c45fd686496a924a15ef81YY').error(new ErrorEvent('some error'));
  });

  it('Get repo commit status by URL and sha with cached value', (done: DoneFn) => {
    ghService
      .getRepoCommitStatusByUrl('https://github.com/fabric8-services/fabric8-wit.git', '225368a414f88bd3c45fd686496a924a15ef81b0')
      .first()
      .subscribe((data: GitHubRepoCommit) => {
        expect(data.sha).toEqual(expectedGitHubRepoCommit.sha);
        const ghService: GitHubService = TestBed.get(GitHubService);
        const cachedValue: Observable<any> = ghService.getCache('https://api.github.com/repos/fabric8-services/fabric8-wit/commits/225368a414f88bd3c45fd686496a924a15ef81b0');
        expect(cachedValue !== undefined).toBeTruthy();
        controller.verify();

        controller.expectNone('https://api.github.com/repos/fabric8-services/fabric8-wit/commits/225368a414f88bd3c45fd686496a924a15ef81b0');
        ghService
          .getRepoCommitStatusByUrl('https://github.com/fabric8-services/fabric8-wit.git', '225368a414f88bd3c45fd686496a924a15ef81b0')
          .first()
          .subscribe((data: GitHubRepoCommit) => {
            // then value cached
            expect(data.sha).toEqual(expectedGitHubRepoCommit.sha);
            const ghService: GitHubService = TestBed.get(GitHubService);
            const cachedValue: Observable<any> = ghService.getCache('https://api.github.com/repos/fabric8-services/fabric8-wit/commits/225368a414f88bd3c45fd686496a924a15ef81b0');
            expect(cachedValue !== undefined).toBeTruthy();
            controller.verify();
            done();
          });
      });
    controller.expectOne('https://api.github.com/repos/fabric8-services/fabric8-wit/commits/225368a414f88bd3c45fd686496a924a15ef81b0').flush(expectedGitHubRepoCommit);
  });

  it('Get repo details by full name', (done: DoneFn) => {
    ghService
      .getRepoDetailsByFullName('fabric8-services/fabric8-wit')
      .first()
      .subscribe((data: GitHubRepoDetails) => {
        expect(data.id).toEqual(expectedGitHubRepoDetails.id);
        controller.verify();
        done();
      });
    controller.expectOne('https://api.github.com/repos/fabric8-services/fabric8-wit').flush(expectedGitHubRepoDetails);
  });

  it('Get repo details by full name in error', (done: DoneFn) => {
    ghService
      .getRepoDetailsByFullName('fabric8-services/fabric8-wit')
      .subscribe(
        () => {
          done.fail('Get repo details by full name in error');
        },
        error => {
          expect(error).toEqual('Http failure response for https://api.github.com/repos/fabric8-services/fabric8-wit: 0 ');
          controller.verify();
          done();
        }
      );
    controller.expectOne('https://api.github.com/repos/fabric8-services/fabric8-wit').error(new ErrorEvent('some error'));
  });

  it('Get repo details by full name cached', (done: DoneFn) => {
    ghService
      .getRepoDetailsByFullName('fabric8-services/fabric8-wit')
      .first()
      .subscribe((data: GitHubRepoDetails) => {
        expect(data.id).toEqual(expectedGitHubRepoDetails.id);
        controller.verify();

        controller.expectNone('https://api.github.com/repos/fabric8-services/fabric8-wit');
        ghService
          .getRepoDetailsByFullName('fabric8-services/fabric8-wit')
          .first()
          .subscribe((data: GitHubRepoDetails) => {
            // then value cached
            expect(data.id).toEqual(expectedGitHubRepoDetails.id);
            const ghService: GitHubService = TestBed.get(GitHubService);
            const cachedValue: Observable<any> = ghService.getCache('https://api.github.com/repos/fabric8-services/fabric8-wit');
            expect(cachedValue !== undefined).toBeTruthy();
            controller.verify();
            done();
          });
      });
    controller.expectOne('https://api.github.com/repos/fabric8-services/fabric8-wit').flush(expectedGitHubRepoDetails);
  });

  it('Get repo details by URL', (done: DoneFn) => {
    ghService
      .getRepoDetailsByUrl('https://github.com/fabric8-services/fabric8-wit.git')
      .first()
      .subscribe((data: GitHubRepoDetails) => {
        expect(data.full_name).toEqual(expectedGitHubRepoDetails.full_name);
        controller.verify();
        done();
      });
    controller.expectOne('https://api.github.com/repos/fabric8-services/fabric8-wit').flush(expectedGitHubRepoDetails);
  });

  it('Get GitHub repo last commit for given URL', (done: DoneFn) => {
    ghService
      .getRepoLastCommitByUrl('https://github.com/fabric8-services/fabric8-wit.git')
      .first()
      .subscribe((data: any) => {
        expect(data.sha).toEqual(expectedGitHubRepoCommit.sha);
        controller.verify();
        done();
      });
    controller.expectOne('https://api.github.com/repos/fabric8-services/fabric8-wit/git/refs/heads/master').flush(expectedGitHubRepoCommit);
  });

  it('Get GitHub repo last commit for given URL in error', (done: DoneFn) => {
    ghService
      .getRepoLastCommitByUrl('https://github.com/fabric8-services/fabric8-wit.git')
      .subscribe(
        () => {
          done.fail('Get GitHub repo last commit for given URL in error');
        },
        error => {
          expect(error).toEqual('Http failure response for https://api.github.com/repos/fabric8-services/fabric8-wit/git/refs/heads/master: 0 ');
          controller.verify();
          done();
        }
      );
    controller.expectOne('https://api.github.com/repos/fabric8-services/fabric8-wit/git/refs/heads/master').error(new ErrorEvent('some error'));
  });

  it('Get GitHub repo last commit for given URL cached', (done: DoneFn) => {
    ghService
      .getRepoLastCommitByUrl('https://github.com/fabric8-services/fabric8-wit.git')
      .first()
      .subscribe((data: any) => {
        expect(data.sha).toEqual(expectedGitHubRepoCommit.sha);
        controller.verify();

        controller.expectNone('https://api.github.com/repos/fabric8-services/fabric8-wit/git/refs/heads/master');
        ghService
          .getRepoLastCommitByUrl('https://github.com/fabric8-services/fabric8-wit.git')
          .first()
          .subscribe((data: any) => {
            // then value cached
            expect(data.sha).toEqual(expectedGitHubRepoCommit.sha);
            const ghService: GitHubService = TestBed.get(GitHubService);
            const cachedValue: Observable<any> = ghService.getCache('https://api.github.com/repos/fabric8-services/fabric8-wit/git/refs/heads/master');
            expect(cachedValue !== undefined).toBeTruthy();
            controller.verify();
            done();
          });
      });
    controller.expectOne('https://api.github.com/repos/fabric8-services/fabric8-wit/git/refs/heads/master').flush(expectedGitHubRepoCommit);
  });

  it('Get GitHub repo license for given full name', (done: DoneFn) => {
    ghService
      .getRepoLicenseByName('fabric8-services/fabric8-wit')
      .first()
      .subscribe((data: GitHubRepoLicense) => {
        expect(data.sha).toEqual(expectedGitHubRepoLicense.sha);
        controller.verify();
        done();
      });
    controller.expectOne('https://api.github.com/repos/fabric8-services/fabric8-wit/license').flush(expectedGitHubRepoLicense);
  });

  it('Get GitHub repo license for given full name in error', (done: DoneFn) => {
    ghService
      .getRepoLicenseByName('fabric8-services/fabric8-wit')
      .subscribe(
        () => {
          done.fail('Get GitHub repo license for given full name in error');
        },
        error => {
          expect(error).toEqual('Http failure response for https://api.github.com/repos/fabric8-services/fabric8-wit/license: 0 ');
          controller.verify();
          done();
        }
      );
    controller.expectOne('https://api.github.com/repos/fabric8-services/fabric8-wit/license').error(new ErrorEvent('some error'));
  });

  it('Get GitHub repo license for given full name cached', (done: DoneFn) => {
    ghService
      .getRepoLicenseByName('fabric8-services/fabric8-wit')
      .first()
      .subscribe((data: GitHubRepoLicense) => {
        expect(data.sha).toEqual(expectedGitHubRepoLicense.sha);
        controller.verify();

        controller.expectNone('https://api.github.com/repos/fabric8-services/fabric8-wit/license');
        ghService
          .getRepoLicenseByName('fabric8-services/fabric8-wit')
          .first()
          .subscribe((data: GitHubRepoLicense) => {
            // then value cached
            expect(data.sha).toEqual(expectedGitHubRepoLicense.sha);
            const ghService: GitHubService = TestBed.get(GitHubService);
            const cachedValue: Observable<any> = ghService.getCache('https://api.github.com/repos/fabric8-services/fabric8-wit/license');
            expect(cachedValue !== undefined).toBeTruthy();
            controller.verify();
            done();
          });
      });
    controller.expectOne('https://api.github.com/repos/fabric8-services/fabric8-wit/license').flush(expectedGitHubRepoLicense);
  });

  it('Get GitHub repo license for given URL', (done: DoneFn) => {
    ghService
      .getRepoLicenseByUrl('https://github.com/fabric8-services/fabric8-wit.git')
      .first()
      .subscribe((data: GitHubRepoLicense) => {
        expect(data.sha).toEqual(expectedGitHubRepoLicense.sha);
        controller.verify();
        done();
      });
    controller.expectOne('https://api.github.com/repos/fabric8-services/fabric8-wit/license').flush(expectedGitHubRepoLicense);
  });

  //////

  it('Get GitHub repos associated with given user name', (done: DoneFn) => {
    const repos: GitHubRepo[] = [expectedGitHubRepo];
    ghService
      .getUserRepos('me')
      .first()
      .subscribe((data: GitHubRepo[]) => {
        expect(data).toEqual(repos);
        controller.verify();
        done();
      });
    controller.expectOne('https://api.github.com/users/me/repos').flush(repos);
  });

  it('Get GitHub repos associated with given user name in error', (done: DoneFn) => {
    ghService
      .getUserRepos('me')
      .subscribe(
        () => {
          done.fail('Get GitHub repos associated with given user name in error');
        },
        error => {
          expect(error).toEqual('Http failure response for https://api.github.com/users/me/repos: 0 ');
          controller.verify();
          done();
        }
      );
    controller.expectOne('https://api.github.com/users/me/repos').error(new ErrorEvent('some error'));
  });

  it('Get GitHub repos associated with given user name cached', (done: DoneFn) => {
    const repos: GitHubRepo[] = [expectedGitHubRepo];
    ghService
      .getUserRepos('me')
      .first()
      .subscribe((data: GitHubRepo[]) => {
        expect(data).toEqual(repos);
        controller.verify();

        controller.expectNone('https://api.github.com/users/me/repos');
        ghService
          .getUserRepos('me')
          .first()
          .subscribe((data: any) => {
            // then value cached
            expect(data[0].full_name).toEqual(repos[0].full_name);
            const ghService: GitHubService = TestBed.get(GitHubService);
            const cachedValue: Observable<any> = ghService.getCache('https://api.github.com/users/me/repos');
            expect(cachedValue !== undefined).toBeTruthy();
            controller.verify();
            done();
          });
      });
      controller.expectOne('https://api.github.com/users/me/repos').flush(repos);
  });
});


describe('Github: GitHubService', () => {
  let mockAuthService: any;
  let ghService: GitHubService;

  beforeEach(() => {
    mockAuthService = jasmine.createSpy('AuthenticationService');
    mockAuthService.gitHubToken = Observable.of('XXX');
    initTestBed(mockAuthService);
    ghService = TestBed.get(GitHubService);
  });

  it('Get GiHub headers for given user name', () => {
    const expectedHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': 'token XXX'
    });
    ghService
      .getHeaders()
      .first()
      .subscribe((data: HttpHeaders) => {
        expect(data.keys()).toEqual(expectedHeaders.keys());
        expectedHeaders.keys().forEach((key: string): void => {
          expect(expectedHeaders.get(key)).toEqual(data.get(key));
        });
      });
  });
});
