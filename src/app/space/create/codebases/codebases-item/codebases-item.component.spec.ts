import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2/dist/index';
import { Broadcaster, Notifications } from 'ngx-base';
import { Observable } from 'rxjs';

import { CodebasesService } from '../services/codebases.service';
import { CodebasesItemComponent } from './codebases-item.component';

describe('Codebases Item Component', () => {
  let broadcasterMock: any;
  let fixture, codebases, codebase;
  let mockNotifications: any;
  let mockCodebasesService: any;

  beforeEach(() => {
    broadcasterMock = jasmine.createSpyObj('Broadcaster', ['on']);
    mockNotifications = jasmine.createSpy('Notifications');
    mockCodebasesService = jasmine.createSpy('CodebasesService');

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule, JWBootstrapSwitchModule],
      declarations: [CodebasesItemComponent],
      providers: [
        { provide: Notifications, useValue: mockNotifications },
        {
          provide: Broadcaster, useValue: broadcasterMock
        },
        {
          provide: CodebasesService, useValue: mockCodebasesService
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
        'cve-scan': true,
        'type': 'git',
        'url': 'https://github.com/fabric8-services/fabric8-wit.git'
      },
      'gitHubRepo': {
        'htmlUrl': 'https://github.com/fabric8-services/fabric8-wit',
        'fullName': 'fabric8-services/fabric8-wit'
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
    fixture = TestBed.createComponent(CodebasesItemComponent);
  });

  it('Init component successfully', async(() => {
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
