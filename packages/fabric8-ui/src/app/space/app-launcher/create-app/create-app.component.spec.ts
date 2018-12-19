import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Notifications, NotificationType } from 'ngx-base';
import { Feature, FeatureFlagModule, FeatureTogglesService } from 'ngx-feature-flag';
import {
  Booster,
  Catalog,
  DependencyCheck,
  DependencyCheckService,
  GitProviderService,
  LauncherModule,
  MissionRuntimeService,
  Pipeline,
  PipelineService,
  ProjectSummaryService,
} from 'ngx-launcher';
import { of } from 'rxjs';
import { createMock } from 'testing/mock';
import { CheService } from '../../create/codebases/services/che.service';
import { WorkspacesService } from '../../create/codebases/services/workspaces.service';
import { AppLauncherDependencyCheckService } from '../services/app-launcher-dependency-check.service';
import { AppLauncherGitproviderService } from '../services/app-launcher-gitprovider.service';
import { AppLauncherMissionRuntimeService } from '../services/app-launcher-mission-runtime.service';
import { AppLauncherPipelineService } from '../services/app-launcher-pipeline.service';
import { CreateAppComponent } from './create-app.component';

describe('CreateAppComponent', () => {
  let component: CreateAppComponent;
  let fixture: ComponentFixture<CreateAppComponent>;
  let cheService: jasmine.SpyObj<CheService>;
  let workSpaceService: jasmine.SpyObj<WorkspacesService>;
  const mockFeature: Feature = {
    attributes: {
      name: 'mock-attribute',
      enabled: true,
      'user-enabled': true,
    },
  } as Feature;
  let featureTogglesService: jasmine.SpyObj<FeatureTogglesService>;

  let missionRuntimeService: jasmine.SpyObj<AppLauncherMissionRuntimeService>;
  const mockboosters: Booster[] = [
    {
      name: '',
      mission: {
        id: '',
        name: '',
      },
      runtime: {
        id: '',
        name: '',
        icon: '',
      },
      version: {
        id: '',
        name: '',
      },
    },
  ];
  const mockCatalog: Catalog = {
    missions: [],
    runtimes: [],
    boosters: [],
  };

  let pipelineService: jasmine.SpyObj<AppLauncherPipelineService>;
  const mockPipeline: Pipeline[] = [
    {
      name: '',
      id: '',
      platform: '',
      stages: [
        {
          name: '',
          description: '',
        },
      ],
    },
  ];

  let gitProviderService: jasmine.SpyObj<AppLauncherGitproviderService>;
  let dependencyCheckService: jasmine.SpyObj<AppLauncherDependencyCheckService>;
  const mockDepencyCheck: DependencyCheck = {
    groupId: '',
    mavenArtifact: '',
    projectName: '',
    projectVersion: '',
    spacePath: '',
  };

  beforeEach(async(() => {
    cheService = createMock(CheService);
    cheService.getState.and.returnValue(of({ running: false, multiTenant: false }));
    cheService.start.and.returnValue(of({ running: true, multiTenant: false }));

    workSpaceService = createMock(WorkspacesService);
    workSpaceService.createWorkspace.and.returnValue(
      of({ links: { open: 'https://che.prod-preview.openshift.io/preview/woj9w' } }),
    );
    workSpaceService.getWorkspaces.and.returnValue(
      of({ data: [{ attributes: { name: 'woj9w', description: '' }, type: 'workspaces' }] }),
    );
    workSpaceService.openWorkspace.and.returnValue(of({}));

    featureTogglesService = createMock(FeatureTogglesService);
    featureTogglesService.getFeature.and.returnValue(of(mockFeature));
    featureTogglesService.isFeatureUserEnabled.and.returnValue(of(true));

    missionRuntimeService = createMock(AppLauncherMissionRuntimeService);
    missionRuntimeService.getBoosters.and.returnValue(of(mockboosters));
    missionRuntimeService.getCatalog.and.returnValue(of(mockCatalog));

    pipelineService = createMock(AppLauncherPipelineService);
    pipelineService.getPipelines.and.returnValue(of(mockPipeline));

    gitProviderService = createMock(AppLauncherGitproviderService);
    gitProviderService.getGitHubDetails.and.returnValue(of({}));
    gitProviderService.getGitHubRepoList.and.returnValue(of({}));

    dependencyCheckService = createMock(AppLauncherDependencyCheckService);
    dependencyCheckService.getDependencyCheck.and.returnValue(of(mockDepencyCheck));
    dependencyCheckService.getApplicationsInASpace.and.returnValue(
      of([{ attributes: { name: 'app-1' } }]),
    );

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        LauncherModule,
        FeatureFlagModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      declarations: [CreateAppComponent],
      providers: [
        ProjectSummaryService,
        {
          provide: CheService,
          useFactory: () => cheService,
          deps: [],
        },
        {
          provide: WorkspacesService,
          useFactory: () => workSpaceService,
          deps: [],
        },
        {
          provide: FeatureTogglesService,
          useFactory: () => featureTogglesService,
          deps: [],
        },
        {
          provide: MissionRuntimeService,
          useFactory: () => missionRuntimeService,
          deps: [],
        },
        {
          provide: PipelineService,
          useFactory: () => pipelineService,
          deps: [],
        },
        {
          provide: GitProviderService,
          useFactory: () => gitProviderService,
          deps: [],
        },
        {
          provide: DependencyCheckService,
          useFactory: () => dependencyCheckService,
          deps: [],
        },
        {
          provide: Notifications,
          useFactory: (): jasmine.SpyObj<Notifications> => {
            const mock: jasmine.SpyObj<Notifications> = createMock(Notifications);
            mock.message.and.returnValue(of({}));
            return mock;
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should add query params', async(() => {
    component.projectName = 'app-1';
    fixture.detectChanges();
    const query = { q: '{"application":["' + component.projectName + '"]}' };
    expect(component.addQuery()).toEqual(query);
  }));
});
