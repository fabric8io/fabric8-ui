import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Logger } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';

import { GitHubService } from '../services/github.service';
import { ContextsMock, expectedGitHubRepoCommit, expectedGitHubRepoDetails, expectedGitHubRepoLicense } from '../services/github.service.mock';
import { CodebasesItemDetailsComponent } from './codebases-item-details.component';

describe('Codebases Item Details Component', () => {
  let gitHubServiceMock: any;
  let loggerMock: any;
  let fixture;

  beforeEach(() => {
    gitHubServiceMock = jasmine.createSpyObj('GitHubService', ['getRepoDetailsByUrl', 'getRepoLastCommitByUrl', 'getRepoCommitStatusByUrl', 'getRepoLicenseByUrl']);
    loggerMock = jasmine.createSpy('Logger');

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [CodebasesItemDetailsComponent],
      providers: [
        {
          provide: Contexts, useClass: ContextsMock
        },
        {
          provide: GitHubService, useValue: gitHubServiceMock
        },
        {
          provide: Logger, useValue: loggerMock
        }
      ],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(CodebasesItemDetailsComponent);
  });

  it('Init component', async(() => {
    // given
    let comp = fixture.componentInstance;
    comp.codebase = { 'id': '6f5b6738-170e-490e-b3bb-d10f56b587c8', attributes: { type: 'git', url: 'toto/toto' } };
    const expectedLastCommit = {
      'ref': '',
      'url': 'toto/toto',
      'object': {
        'sha': 'SHA-LALA-SHA-LALALA',
        'type': 'file',
        'url': 'toto'
      }
    };
    gitHubServiceMock.getRepoDetailsByUrl.and.returnValue(Observable.of(expectedGitHubRepoDetails));
    gitHubServiceMock.getRepoLastCommitByUrl.and.returnValue(Observable.of(expectedLastCommit));
    gitHubServiceMock.getRepoLicenseByUrl.and.returnValue(Observable.of(expectedGitHubRepoLicense));
    gitHubServiceMock.getRepoCommitStatusByUrl.and.returnValue(Observable.of(expectedGitHubRepoCommit));
    fixture.detectChanges();

    // when init

    // then
    expect(gitHubServiceMock.getRepoDetailsByUrl).toHaveBeenCalled();
    expect(gitHubServiceMock.getRepoLastCommitByUrl).toHaveBeenCalled();
    expect(gitHubServiceMock.getRepoLicenseByUrl).toHaveBeenCalled();
    expect(gitHubServiceMock.getRepoCommitStatusByUrl).toHaveBeenCalled();
  }));

});
