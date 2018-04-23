import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Broadcaster, Notifications } from 'ngx-base';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';

import { WindowService } from 'app/shared/window.service';
import { CodebasesService } from '../services/codebases.service';
import { GitHubService } from '../services/github.service';
import { WorkspacesService } from '../services/workspaces.service';
import { CodebasesItemActionsComponent } from './codebases-item-actions.component';

describe('Codebases Item Actions Component', () => {
  let dialogMock: any;
  let gitHubServiceMock: any;
  let notificationMock: any;
  let fixture;
  let broadcasterMock: any;
  let windowServiceMock: any;
  let workspacesServiceMock: any;
  let codebasesServiceMock: any;

  beforeEach(() => {
    gitHubServiceMock = jasmine.createSpy('GitHubService');
    dialogMock = jasmine.createSpyObj('bs-modal', ['show', 'hide']);
    notificationMock = jasmine.createSpyObj('Notifications', ['message']);
    broadcasterMock = jasmine.createSpyObj('Broadcaster', ['broadcast', 'on']);
    windowServiceMock = jasmine.createSpyObj('WindowService', ['open']);
    workspacesServiceMock = jasmine.createSpyObj('WorkspacesService', ['createWorkspace']);
    codebasesServiceMock = jasmine.createSpyObj('CodebasesService', ['deleteCodebase']);

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule, ModalModule.forRoot()],
      declarations: [CodebasesItemActionsComponent],
      providers: [
        {
          provide: Broadcaster, useValue: broadcasterMock
        },
        {
          provide: WindowService, useValue: windowServiceMock
        },
        {
          provide: WorkspacesService, useValue: workspacesServiceMock
        },
        {
          provide: CodebasesService, useValue: codebasesServiceMock
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
    fixture = TestBed.createComponent(CodebasesItemActionsComponent);
  });

  it('Create And Open Workspace successfully', async(() => {
    // given
    let comp = fixture.componentInstance;
    comp.codebase = { 'id': '6f5b6738-170e-490e-b3bb-d10f56b587c8' };
    const workspaceLinks = {
      links: {
        open: 'http://somehwere.com'
      }
    };
    workspacesServiceMock.createWorkspace.and.returnValue(Observable.of(workspaceLinks));
    windowServiceMock.open.and.returnValue(new WindowService());
    const notificationAction = { name: 'created' };
    notificationMock.message.and.returnValue(Observable.of(notificationAction));
    broadcasterMock.broadcast.and.returnValue();
    broadcasterMock.on.and.returnValue(Observable.of({ running: true }));
    fixture.detectChanges();
    // when
    comp.createAndOpenWorkspace();
    fixture.detectChanges();
    // then
    expect(notificationMock.message).toHaveBeenCalled();
    expect(windowServiceMock.open).toHaveBeenCalled();
    expect(broadcasterMock.broadcast).toHaveBeenCalled();
  }));

  it('Create And Open Workspace in error', async(() => {
    // given
    let comp = fixture.componentInstance;
    comp.codebase = { 'id': '6f5b6738-170e-490e-b3bb-d10f56b587c8' };
    workspacesServiceMock.createWorkspace.and.returnValue(Observable.throw('ERROR'));
    const notificationAction = { name: 'ERROR' };
    notificationMock.message.and.returnValue(Observable.of(notificationAction));
    broadcasterMock.on.and.returnValue(Observable.of({ running: true }));
    fixture.detectChanges();
    // when
    comp.createAndOpenWorkspace();
    fixture.detectChanges();
    // then
    expect(notificationMock.message).toHaveBeenCalled();
  }));


  it('Delete codebase successfully', async(() => {
    // given
    let comp = fixture.componentInstance;
    comp.codebase = { 'id': '6f5b6738-170e-490e-b3bb-d10f56b587c8' };
    comp.deleteCodebaseDialog = dialogMock;
    codebasesServiceMock.deleteCodebase.and.returnValue(Observable.of(comp.codebase));
    broadcasterMock.on.and.returnValue(Observable.of({ running: true }));
  //  broadcasterMock.on.and.returnValue(Observable.of(code));
    fixture.detectChanges();
    // when
    comp.deleteCodebase();
    fixture.detectChanges();
    expect(broadcasterMock.broadcast).toHaveBeenCalled();
  }));

  it('Delete codebase error', async(() => {
    // given
    let comp = fixture.componentInstance;
    comp.codebase = { 'id': '6f5b6738-170e-490e-b3bb-d10f56b587c8' };
    comp.deleteCodebaseDialog = dialogMock;
    codebasesServiceMock.deleteCodebase.and.returnValue(Observable.throw('ERROR'));
    const notificationAction = { name: 'ERROR' };
    notificationMock.message.and.returnValue(Observable.of(notificationAction));
    broadcasterMock.on.and.returnValue(Observable.of({ running: true }));
    fixture.detectChanges();
    // when
    comp.deleteCodebase();
    fixture.detectChanges();
    // then
    expect(notificationMock.message).toHaveBeenCalled();
  }));
});
