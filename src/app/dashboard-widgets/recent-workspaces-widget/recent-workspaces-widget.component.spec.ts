import { DebugNode } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { Notifications } from 'ngx-base';
import { Spaces, SpaceService } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
import { ContextService } from '../../shared/context.service';
import { spaceMock } from '../../shared/context.service.mock';

import { WindowService } from 'app/shared/window.service';
import { LoadingWidgetModule } from '../../dashboard-widgets/loading-widget/loading-widget.module';
import { CodebasesService } from '../../space/create/codebases/services/codebases.service';
import { Workspace, WorkspaceLinks } from '../../space/create/codebases/services/workspace';
import { WorkspacesService } from '../../space/create/codebases/services/workspaces.service';
import { ExtCodebase, RecentWorkspacesWidgetComponent } from './recent-workspaces-widget.component';

describe('RecentWorkspacesWidgetComponent', () => {
  let comp: RecentWorkspacesWidgetComponent;
  let fixture: ComponentFixture<RecentWorkspacesWidgetComponent>;
  let codebase: ExtCodebase;
  let codebases: ExtCodebase[];
  let component: DebugNode['componentInstance'];
  let workspace: Workspace;
  let workspaces: Workspace[];
  let workspaceLinks: WorkspaceLinks;

  let mockCodebasesService: any;
  let mockContextService: any;
  let mockSpaceService: any;
  let mockNotifications: any;
  let mockProfileService: any;
  let mockWindowService: any;
  let mockWorkspacesService: any;

  beforeEach(() => {
    mockCodebasesService = jasmine.createSpyObj('CodebasesService', ['getCodebases']);
    mockContextService = jasmine.createSpy('ContextService');
    mockSpaceService = jasmine.createSpyObj('SpaceService', ['getSpaceByName']);
    mockSpaceService.getSpaceByName.and.returnValue(Observable.of(spaceMock));
    mockNotifications = jasmine.createSpy('Notifications');
    mockWindowService = jasmine.createSpyObj('WindowService', ['open']);
    mockWorkspacesService = jasmine.createSpyObj('WorkspacesService', ['getWorkspaces', 'openWorkspace']);

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        LoadingWidgetModule,
        TooltipModule.forRoot()
      ],
      declarations: [RecentWorkspacesWidgetComponent],
      providers: [
        { provide: CodebasesService, useValue: mockCodebasesService },
        { provide: ContextService, useValue: mockContextService },
        { provide: SpaceService, useValue: mockSpaceService },
        { provide: Notifications, useValue: mockNotifications },
        { provide: Spaces, useValue: {
            'current': Observable.of(spaceMock),
            'recent': Observable.of([spaceMock])
          } as Spaces
        },
        { provide: WindowService, useValue: mockWindowService },
        { provide: WorkspacesService, useValue: mockWorkspacesService },
        TooltipConfig
      ]
    });

    codebase = {
      'attributes': {
        'type': 'git',
        'url': 'https://github.com/fabric8-ui/fabric8-ui.git'
      },
      'type': 'codebases'
    } as ExtCodebase;
    codebases = [codebase];
    mockCodebasesService.getCodebases.and.returnValue(Observable.of(codebases));

    workspace = {
      attributes: {
        description: 'description',
        name: 'name'
      },
      links: { open: 'url' },
      type: 'git'
    };
    workspaces = [workspace];
    mockWorkspacesService.getWorkspaces.and.returnValue(Observable.of(workspaces));

    workspaceLinks = {
      links: { open: 'url' }
    };
    mockWorkspacesService.openWorkspace.and.returnValue(Observable.of(workspaceLinks));

    mockWindowService.open.and.returnValue({location: { href: 'url'}});

    fixture = TestBed.createComponent(RecentWorkspacesWidgetComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('Should output a workspace link', () => {
    let workspaces = fixture.debugElement.queryAll(By.css('.list-group-item-text a'));
    expect(workspaces.length).toBe(1);
  });

  it('Should open workspace', async(() => {
    let workspaces = fixture.debugElement.queryAll(By.css('.list-group-item-text a'));
    workspaces[0].triggerEventHandler('click', new CustomEvent('click'));
    fixture.detectChanges();
    expect(mockWindowService.open).toHaveBeenCalled();
  }));
});
