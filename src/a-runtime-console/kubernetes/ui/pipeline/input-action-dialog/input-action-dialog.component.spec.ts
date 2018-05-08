import { Component, DebugNode, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { ModalModule } from 'ngx-modal';

import { Notification, Notifications, NotificationType } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { InputActionDialog } from './input-action-dialog.component';

import { FABRIC8_FORGE_API_URL } from 'app/shared/runtime-console/fabric8-ui-forge-api';

describe('Input Action Dialog: ', () => {
  let fixture: ComponentFixture<InputActionDialog>;
  let component: DebugNode['componentInstance'];
  let mockService: MockBackend;
  let mockAuthenticationService: any = jasmine.createSpyObj('AuthenticationService', ['getToken']);
  let mockNotifications: any = jasmine.createSpyObj('Notifications', ['message']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, ModalModule],
      declarations: [InputActionDialog],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: XHRBackend, useClass: MockBackend },
        { provide: Notifications, useValue: mockNotifications },
        { provide: FABRIC8_FORGE_API_URL, useValue: 'http://example.com'}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(InputActionDialog);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    mockService = TestBed.get(XHRBackend);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('It should send status 200 when Jenkins is up', () => {
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify({}),
          status: 200
        })
      ));
    });
    // when
    component.callJenkins().subscribe((res: any) => {
      // then
      expect(res.status).toEqual(200);
    });
    let message = {
      message: 'Got 200, Jenkins is up and running.',
      type: NotificationType.SUCCESS
    };
    component.checkIfJenkinsIsUpAndProceedURL();
    expect(component.notifications.message).toHaveBeenCalledWith(message);
  });

});
