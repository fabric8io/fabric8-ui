/* tslint:disable:no-unused-variable */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MomentModule } from 'angular2-moment';
import { AUTH_API_URL, AuthenticationService } from 'ngx-login-client';
import { ModalModule } from 'ngx-modal';
import { Observable, of as observableOf } from 'rxjs';
import { JenkinsService } from '../../../../../app/shared/jenkins.service';
import { FABRIC8_FORGE_API_URL } from '../../../../../app/shared/runtime-console/fabric8-ui-forge-api';
import { FABRIC8_JENKINS_API_URL } from '../../../../../app/shared/runtime-console/fabric8-ui-jenkins-api';
import { InputActionDialog } from './input-action-dialog.component';

describe('InputActionDialog', () => {
  let component: InputActionDialog;
  let fixture: ComponentFixture<InputActionDialog>;
  let fakeAuthService: any;
  let element: HTMLElement;

  let mockJenkinsService = {
    getJenkinsStatus(): Observable<any> {
      let jenkinsStatus = observableOf([
        {
          data: { state: 'idled' },
        } as any,
      ]);
      return jenkinsStatus;
    },
  };

  beforeEach(async(() => {
    fakeAuthService = {
      getToken: function() {
        return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiY2xpZW50X3Nlc3Npb24iOiJURVNUU0VTU0lPTiIsInNlc3Npb25fc3RhdGUiOiJURVNUU0VTU0lPTlNUQVRFIiwiYWRtaW4iOnRydWUsImp0aSI6ImY5NWQyNmZlLWFkYzgtNDc0YS05MTk0LWRjM2E0YWFiYzUwMiIsImlhdCI6MTUxMDU3MTMxOSwiZXhwIjoxNTEwNTgwODI3fQ.l0m6EFvk5jbND3VOXL3gTkzTz0lYQtPtXS_6C24kPQk';
      },
      isLoggedIn: function() {
        return true;
      },
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ModalModule,
        MomentModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [InputActionDialog],
      providers: [
        {
          provide: AUTH_API_URL,
          useValue: 'https://auth.fabric8.io/api/',
        },
        {
          provide: AuthenticationService,
          useValue: fakeAuthService,
        },
        {
          provide: FABRIC8_FORGE_API_URL,
          useValue: 'http://fabric8.forge.api.url/',
        },
        {
          provide: FABRIC8_JENKINS_API_URL,
          useValue: 'http://fabric8.jenkins.api.url/',
        },
        {
          provide: JenkinsService,
          useValue: mockJenkinsService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputActionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
