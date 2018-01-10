import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Broadcaster, Notifications } from 'ngx-base';
import { Observable } from 'rxjs';

import { WindowService } from '../services/window.service';
import { WorkspacesService } from '../services/workspaces.service';
import { CodebasesItemWorkspacesComponent } from './codebases-item-workspaces.component';

describe('Codebases Item Details Component', () => {
  let broadcasterMock: any;
  let windowServiceMock: any;
  let workspacesServiceMock: any;
  let notificationMock: any;
  let fixture, comp;
  let expectedWorkspace, expectedWorkspaces;

  beforeEach(() => {
    broadcasterMock = jasmine.createSpyObj('Broadcaster', ['on']);
    windowServiceMock = jasmine.createSpyObj('WindowService', ['open']);
    workspacesServiceMock = jasmine.createSpyObj('WorkspacesService', ['getWorkspaces', 'createWorkspace', 'openWorkspace']);
    notificationMock = jasmine.createSpyObj('Notifications', ['message']);

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [CodebasesItemWorkspacesComponent],
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
          provide: Notifications, useValue: notificationMock
        }
      ],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(CodebasesItemWorkspacesComponent);
    comp = fixture.componentInstance;
    comp.codebase = { 'id': '6f5b6738-170e-490e-b3bb-d10f56b587c8', attributes: { type: 'git', url: 'toto/toto', last_used_workspace: 'me' } };
    expectedWorkspace = {
      attributes: {
        description: 'description',
        name: 'name'
      },
      links: { open: 'url' },
      type: 'git'
    };
    expectedWorkspaces = [expectedWorkspace];
    const workspaceCreatedEvent = {
      codebase: { 'id': '6f5b6738-170e-490e-b3bb-d10f56b587c8', attributes: { type: 'git', url: 'toto/toto' } },
      workspaceName: 'MyWorkspace'
    };
    workspacesServiceMock.getWorkspaces.and.returnValue(Observable.of(expectedWorkspaces));
    broadcasterMock.on.and.returnValue(Observable.of(workspaceCreatedEvent));
    spyOn(comp, 'updateWorkspacesPoll');
  });

  it('Init component fetches workspaces', async(() => {
    // given
    fixture.detectChanges();

    // when init
    comp.ngOnInit();

    // then
    expect(workspacesServiceMock.getWorkspaces).toHaveBeenCalled();
    expect(comp.updateWorkspacesPoll).toHaveBeenCalled();
    expect(broadcasterMock.on).toHaveBeenCalled();
  }));

  it('Create and open workspace', async(() => {
    // given
    workspacesServiceMock.createWorkspace.and.returnValue(Observable.of(expectedWorkspace));
    const notificationAction = { name: 'created' };
    notificationMock.message.and.returnValue(Observable.of(notificationAction));
    fixture.detectChanges();

    // when
    comp.createAndOpenWorkspace();

    // then
    expect(workspacesServiceMock.createWorkspace).toHaveBeenCalled();
    expect(notificationMock.message).toHaveBeenCalled();
  }));

  it('Open workspace', async(() => {
    // given
    const workspaceLinks = {
      links: {
        open: 'http://somewhere.com'
      }
    };
    workspacesServiceMock.getWorkspaces.and.returnValue(Observable.of(expectedWorkspaces));
    workspacesServiceMock.openWorkspace.and.returnValue(Observable.of(workspaceLinks));
    windowServiceMock.open.and.returnValue({location: { href: 'test'}});
    const notificationAction = { name: 'created' };
    notificationMock.message.and.returnValue(Observable.of(notificationAction));
    fixture.detectChanges();

    // when
    comp.openWorkspace();

    // then
    expect(workspacesServiceMock.openWorkspace).toHaveBeenCalled();
  }));
});
