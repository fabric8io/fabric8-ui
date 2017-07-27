import { CodebasesItemActionsComponent } from './codebases-item-actions.component';
import { Observable } from 'rxjs';
import { Contexts } from 'ngx-fabric8-wit';
import { Broadcaster, Notifications, NotificationType } from 'ngx-base';
import { CodebasesService } from '../services/codebases.service';
import { GitHubService } from '../services/github.service';
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, NgForm } from '@angular/forms';
import { WindowService } from '../services/window.service';
import { WorkspacesService } from '../services/workspaces.service';
import {
  async,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

describe('Codebases Item Actions Component', () => {
  let gitHubServiceMock: any;
  let notificationMock: any;
  let fixture;
  let broadcasterMock: any;
  let windowServiceMock: any;
  let workspacesServiceMock: any;

  beforeEach(() => {
    gitHubServiceMock = jasmine.createSpy('GitHubService');
    notificationMock = jasmine.createSpyObj('Notifications', ['message']);
    broadcasterMock = jasmine.createSpyObj('Broadcaster', ['broadcast']);
    windowServiceMock = jasmine.createSpyObj('WindowService', ['open']);
    workspacesServiceMock = jasmine.createSpyObj('WorkspacesService', ['createWorkspace']);

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
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

  it('Create And Open Workspace succesfully', async(() => {
    // given
    let comp = fixture.componentInstance;
    comp.codebase = { "id": "6f5b6738-170e-490e-b3bb-d10f56b587c8" };
    const workspaceLinks = {
      links: {
        open: "http://somehwere.com"
      }
    };
    workspacesServiceMock.createWorkspace.and.returnValue(Observable.of(workspaceLinks));
    windowServiceMock.open.and.returnValue(new WindowService());
    const notificationAction = { name: "created" };
    notificationMock.message.and.returnValue(Observable.of(notificationAction));
    broadcasterMock.broadcast.and.returnValue();
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
    comp.codebase = { "id": "6f5b6738-170e-490e-b3bb-d10f56b587c8" };
    workspacesServiceMock.createWorkspace.and.returnValue(Observable.throw('ERROR'));
    const notificationAction = { name: "ERROR" };
    notificationMock.message.and.returnValue(Observable.of(notificationAction));
    fixture.detectChanges();
    // when
    comp.createAndOpenWorkspace();
    fixture.detectChanges();
    // then
    expect(notificationMock.message).toHaveBeenCalled();
  }));
});
