/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http, HttpModule, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MomentModule } from 'angular2-moment';
import { StackDetailsModule } from 'fabric8-stack-analysis-ui';
import { ModalModule } from 'ngx-modal';
import { Observable } from 'rxjs';

import { AUTH_API_URL, AuthenticationService } from 'ngx-login-client';
import { JenkinsService } from '../../../../../app/shared/jenkins.service';
import { FABRIC8_FORGE_API_URL } from '../../../../../app/shared/runtime-console/fabric8-ui-forge-api';
import { FABRIC8_JENKINS_API_URL } from '../../../../../app/shared/runtime-console/fabric8-ui-jenkins-api';
import { InputActionDialog } from '../input-action-dialog/input-action-dialog.component';
import { BuildStatusIconComponent } from './../../../components/build-status-icon/build-status-icon.component';
import { PipelineStatusComponent } from './../../../components/pipeline-status/pipeline-status.component';
import { BuildStageViewComponent } from './build-stage-view.component';
import { StageTimePipe } from './stage-time.pipe';

describe('BuildStageViewComponent', () => {
  let component: BuildStageViewComponent;
  let fixture: ComponentFixture<BuildStageViewComponent>;
  let fakeAuthService: any;
  let element: HTMLElement;
  let buildData: any = {
      'statusPhase': 'Complete',
      'logURL': 'https://jenkins.openshift.io/job/invinciblejai/job/app-test-apr-18-10-43/job/master/1/console',
      'name': 'app-test-apr-18-10-43-1',
      'namespace': 'jakumar',
      'icon': '',
      'iconStyle': 'pficon-ok',
      'id': 'app-test-apr-18-10-43-1',
      'buildConfigName': 'app-test-apr-18-10-43',
      'buildNumber': 1,
      'buildNumberInt': 1,
      'pipelineStages': [{
        'durationMillis': 172579,
        'id': '20',
        'name': 'Build Release',
        'pauseDurationMillis': 0,
        'status': 'SUCCESS'
    },
    {
        'durationMillis': 172579,
        'environmentName': 'Stage',
        'id': '60',
        'name': 'Rollout to Stage',
        'pauseDurationMillis': 0,
        'serviceUrl': 'http://app-test-apr-12-11-jakumar-stage.8a09.starter-us-east-2.openshiftapps.com',
        'serviceUrlMap': {
            'app-test-apr-12-11': 'http://app-test-apr-12-11-jakumar-stage.8a09.starter-us-east-2.openshiftapps.com'
        },
        'status': 'SUCCESS'
    },
    {
        'durationMillis': 172579,
        'id': '20',
        'name': 'Approve',
        'pauseDurationMillis': 0,
        'status': 'FAILED'
    }
    ]
  };

  let buildDataTrigger: any = {
    'statusPhase': 'Running',
    'name': 'app-test-apr-18-10-43-1',
    'namespace': 'jakumar',
    'icon': '',
    'iconStyle': 'pficon-running',
    'id': 'app-test-apr-18-10-43-1',
    'buildConfigName': 'app-test-apr-18-10-43',
    'buildNumber': 1,
    'buildNumberInt': 1,
    'pipelineStages': []
};

  let buildDataRun: any = {
    'statusPhase': 'Running',
    'name': 'app-test-apr-18-10-43-1',
    'namespace': 'jakumar',
    'logURL': 'https://jenkins.openshift.io/job/invinciblejai/job/app-test-apr-18-10-43/job/master/1/console',
    'icon': '',
    'iconStyle': 'pficon-running',
    'id': 'app-test-apr-18-10-43-1',
    'buildConfigName': 'app-test-apr-18-10-43',
    'buildNumber': 1,
    'buildNumberInt': 1,
    'pipelineStages': []
};

  let mockJenkinsService = {
    getJenkinsStatus(): Observable<any> {
      let jenkinsStatus = Observable.of([<any> {
        'data': {'state': 'idled'}
      }]);
      return jenkinsStatus;
    }
  };

  beforeEach(async(() => {
    fakeAuthService = {
      getToken: function() {
        return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiY2xpZW50X3Nlc3Npb24iOiJURVNUU0VTU0lPTiIsInNlc3Npb25fc3RhdGUiOiJURVNUU0VTU0lPTlNUQVRFIiwiYWRtaW4iOnRydWUsImp0aSI6ImY5NWQyNmZlLWFkYzgtNDc0YS05MTk0LWRjM2E0YWFiYzUwMiIsImlhdCI6MTUxMDU3MTMxOSwiZXhwIjoxNTEwNTgwODI3fQ.l0m6EFvk5jbND3VOXL3gTkzTz0lYQtPtXS_6C24kPQk';
      },
      isLoggedIn: function() {
        return true;
      }
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ModalModule,
        MomentModule,
        RouterTestingModule.withRoutes([]),
        StackDetailsModule
      ],
      declarations: [
        BuildStatusIconComponent,
        BuildStageViewComponent,
        InputActionDialog,
        PipelineStatusComponent,
        StageTimePipe
      ],
      providers: [
        BaseRequestOptions,
            MockBackend,
            {
              provide: Http,
              useFactory: (backend: MockBackend,
                           options: BaseRequestOptions) => new Http(backend, options),
              deps: [MockBackend, BaseRequestOptions]
            },
            {
              provide: AUTH_API_URL,
              useValue: 'https://auth.fabric8.io/api/'
            },
            {
                provide: AuthenticationService,
                useValue: fakeAuthService
            },
            {
              provide: FABRIC8_FORGE_API_URL, useValue: 'http://fabric8.forge.api.url/'
            },
            {
              provide: FABRIC8_JENKINS_API_URL, useValue: 'http://fabric8.jenkins.api.url/'
            },
            {
              provide: JenkinsService, useValue: mockJenkinsService
            }
       ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildStageViewComponent);
    component = fixture.componentInstance;
    component.build = buildData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show info message when build not started', () => {
    component.build = buildDataTrigger;
    fixture.detectChanges();
    element = fixture.nativeElement;
    let buildStatusMessageNoLog = element.
      querySelector('#pipeine-stage-name-no-log');
    expect(buildStatusMessageNoLog.innerHTML).toContain('Setting up your build server.');
  });

  it('should not show status message when build started', () => {
    component.build = buildDataRun;
    fixture.detectChanges();
    element = fixture.nativeElement;
    let buildStatusMessageNoLog = element.
      querySelector('#pipeine-stage-name-no-log');
    expect(buildStatusMessageNoLog).toBeNull();
  });

  it('should show info message when stages not started', () => {
    component.build = buildDataRun;
    fixture.detectChanges();
    element = fixture.nativeElement;
    let buildStatusMessageNoStage = element.
      querySelector('#pipeine-stage-name-no-stages');
    expect(buildStatusMessageNoStage.innerHTML).toContain('Build has started.');
  });

  it('should not show status message when stages started', () => {
    component.build = buildData;
    fixture.detectChanges();
    element = fixture.nativeElement;
    let buildStatusMessageNoStage = element.
      querySelector('#pipeine-stage-name-no-stages');
    expect(buildStatusMessageNoStage).toBeNull();
  });

});
