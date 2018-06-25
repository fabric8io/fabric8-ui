import { inject, TestBed } from '@angular/core/testing';
import {
  HttpModule,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { AuthenticationService } from 'ngx-login-client';
import { JenkinsService } from './jenkins.service';
import { FABRIC8_JENKINS_API_URL } from './runtime-console/fabric8-ui-jenkins-api';


function initTestBed() {
    let fakeAuthService: any = {
        getToken: function() {
          return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiY2xpZW50X3Nlc3Npb24iOiJURVNUU0VTU0lPTiIsInNlc3Npb25fc3RhdGUiOiJURVNUU0VTU0lPTlNUQVRFIiwiYWRtaW4iOnRydWUsImp0aSI6ImY5NWQyNmZlLWFkYzgtNDc0YS05MTk0LWRjM2E0YWFiYzUwMiIsImlhdCI6MTUxMDU3MTMxOSwiZXhwIjoxNTEwNTgwODI3fQ.l0m6EFvk5jbND3VOXL3gTkzTz0lYQtPtXS_6C24kPQk';
        },
        isLoggedIn: function() {
          return true;
        }
    };
    TestBed.configureTestingModule({
        imports: [
            HttpModule
        ],
        providers: [
            JenkinsService,
            { provide: AuthenticationService, useValue: fakeAuthService },
            { provide: FABRIC8_JENKINS_API_URL, useValue: 'http://fabric8.jenkins.api.url' },
            { provide: XHRBackend, useClass: MockBackend }
        ]
    });
}

function fakeJenkinsStatus(): any {
    let JenkinsStatus: any = {'data': {'state': 'idled'}};
    return JenkinsStatus;
}

describe('Service: JenkinsService', () => {
    let jenkinsService: JenkinsService;

    beforeEach(() => {
        initTestBed();
        jenkinsService = TestBed.get(JenkinsService);
    });

    it('should return jenkins status', () => {
        inject([JenkinsService, XHRBackend], (service, mockBackend) => {
        mockBackend.connections.subscribe((connection) => {
            connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(fakeJenkinsStatus)
            })));
        });

        service.getJenkinsStatus().subscribe(response => {
            let JenkinsStatus: any = response;
            expect(JenkinsStatus.data.state).toBe('idled');
        });
        });
    });
});
