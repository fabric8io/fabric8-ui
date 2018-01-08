import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';

import { Broadcaster, Notifications } from 'ngx-base';
import { Observable } from 'rxjs';

import { GitHubService } from '../services/github.service';
import { expectedGitHubRepoDetails } from '../services/github.service.mock';
import { CodebasesItemComponent } from './codebases-item.component';

describe('Codebases Item Component', () => {
  let broadcasterMock: any;
  let gitHubServiceMock: any;
  let notificationMock: any;
  let fixture, codebases, codebase;

  beforeEach(() => {
    broadcasterMock = jasmine.createSpyObj('Broadcaster', ['on']);
    gitHubServiceMock = jasmine.createSpyObj('GitHubService', ['getRepoDetailsByUrl']);
    notificationMock = jasmine.createSpyObj('Notifications', ['message']);

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [CodebasesItemComponent],
      providers: [
        {
          provide: Broadcaster, useValue: broadcasterMock
        },
        {
          provide: GitHubService, useValue: gitHubServiceMock
        },
        {
          provide: Notifications, useValue: notificationMock
        }
      ],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });
    codebase = {
      'attributes': {
        'createdAt': '2017-04-28T09:28:22.224442Z',
        'last_used_workspace': '',
        'stackId': '',
        'type': 'git',
        'url': 'https://github.com/fabric8-services/fabric8-wit.git'
      },
      'id': '6f5b6738-170e-490e-b3bb-d10f56b587c8',
      'links': {
        'edit': 'https://api.prod-preview.openshift.io/api/codebases/6f5b6738-170e-490e-b3bb-d10f56b587c8/edit',
        'self': 'https://api.prod-preview.openshift.io/api/codebases/6f5b6738-170e-490e-b3bb-d10f56b587c8'
      },
      'relationships': {
        'space': {
          'data': {
            'id': '1d7af8bf-0346-432d-9096-4e2b59d2db87',
            'type': 'spaces'
          },
          'links': {
            'self': 'https://api.prod-preview.openshift.io/api/spaces/1d7af8bf-0346-432d-9096-4e2b59d2db87'
          }
        }
      },
      'type': 'codebases',
      'name': 'https://github.com/fabric8-services/fabric8-wit',
      'url': 'https///github.com/fabric8-services/fabric8-wit'
    };
    gitHubServiceMock.getRepoDetailsByUrl.and.returnValue(Observable.of(expectedGitHubRepoDetails));
    fixture = TestBed.createComponent(CodebasesItemComponent);
  });

  it('Init component succesfully', async(() => {
    // given
    let comp = fixture.componentInstance;
    let debug = fixture.debugElement;
    comp.codebase = codebase;
    broadcasterMock.on.and.returnValue(Observable.of({ running: true }));
    fixture.detectChanges();
    let spanDisplayedInformation = debug.queryAll(By.css('.list-pf-title'));
    fixture.whenStable().then(() => {
      expect(spanDisplayedInformation.length).toEqual(1);
    });
  }));
});
