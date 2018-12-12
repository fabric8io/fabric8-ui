import { DebugNode } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Notifications } from 'ngx-base';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { Spaces, SpaceService } from 'ngx-fabric8-wit';
import { Observable, of as observableOf,  throwError as observableThrowError } from 'rxjs';
import { ContextService } from '../../shared/context.service';
import { spaceMock } from '../../shared/context.service.mock';
import { WindowService } from '../../shared/window.service';
import { CodebasesService } from '../../space/create/codebases/services/codebases.service';
import { Workspace, WorkspaceLinks } from '../../space/create/codebases/services/workspace';
import { WorkspacesService } from '../../space/create/codebases/services/workspaces.service';
import { LoadingWidgetModule } from '../loading-widget/loading-widget.module';
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
    mockSpaceService.getSpaceByName.and.returnValue(observableOf(spaceMock));
    mockNotifications = jasmine.createSpy('Notifications');
    mockWindowService = jasmine.createSpyObj('WindowService', ['open']);
    mockWorkspacesService = jasmine.createSpyObj('WorkspacesService', ['getWorkspaces', 'openWorkspace']);

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
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
            'current': observableOf(spaceMock),
            'recent': observableOf([spaceMock])
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
    mockCodebasesService.getCodebases.and.returnValue(observableOf(codebases));

    workspace = {
      attributes: {
        description: 'description',
        name: 'name'
      },
      links: { open: 'url' },
      type: 'git'
    };
    workspaces = [workspace];
    mockWorkspacesService.getWorkspaces.and.returnValue(observableOf(workspaces));

    workspaceLinks = {
      links: { open: 'url' }
    };
    mockWorkspacesService.openWorkspace.and.returnValue(observableOf(workspaceLinks));

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

  it('Should not show loading by default', async(() => {
    let loading = fixture.debugElement.query(By.css('.f8-loading'));
    expect(loading).toBeNull();
  }));

  it('Should not show loading if an error occurs with WorkspacesService', async(() => {
    mockWorkspacesService.getWorkspaces.and.returnValue(observableThrowError('workspaces error'));
    let loading = fixture.debugElement.query(By.css('.f8-loading'));
    expect(loading).toBeNull();
  }));
});
