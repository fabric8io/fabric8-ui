import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Feature, FeatureFlagModule, FeatureTogglesService } from 'ngx-feature-flag';
import {
  DependencyCheck,
  DependencyCheckService,
  GitProviderService,
  LauncherModule,
  Pipeline,
  PipelineService,
  ProjectSummaryService
} from 'ngx-launcher';
import { of } from 'rxjs';
import { createMock } from 'testing/mock';
import { AppLauncherDependencyCheckService } from './../services/app-launcher-dependency-check.service';
import { AppLauncherGitproviderService } from './../services/app-launcher-gitprovider.service';
import { AppLauncherPipelineService } from './../services/app-launcher-pipeline.service';
import { ImportAppComponent } from './import-app.component';

describe('CreateAppComponent', () => {
  let component: ImportAppComponent;
  let fixture: ComponentFixture<ImportAppComponent>;
  const mockFeature: Feature = {
    'attributes': {
      'name': 'mock-attribute',
      'enabled': true,
      'user-enabled': true
    }
  } as Feature;
  let featureTogglesService: jasmine.SpyObj<FeatureTogglesService>;

  let pipelineService: jasmine.SpyObj<AppLauncherPipelineService>;
  const mockPipeline: Pipeline[] = [{
    name: '',
    id: '',
    platform: '',
    stages: [{
      name: '',
      description: ''
    }]
  }];

  let gitProviderService: jasmine.SpyObj<AppLauncherGitproviderService>;
  let dependencyCheckService: jasmine.SpyObj<AppLauncherDependencyCheckService>;
  const mockDepencyCheck: DependencyCheck = {
    groupId: '',
    mavenArtifact: '',
    projectName: '',
    projectVersion: '',
    spacePath: ''
  };

  beforeEach(async(() => {

    featureTogglesService = createMock(FeatureTogglesService);
    featureTogglesService.getFeature.and.returnValue(of(mockFeature));
    featureTogglesService.isFeatureUserEnabled.and.returnValue(of(true));

    pipelineService = createMock(AppLauncherPipelineService);
    pipelineService.getPipelines.and.returnValue(of(mockPipeline));

    gitProviderService = createMock(AppLauncherGitproviderService);
    gitProviderService.getGitHubDetails.and.returnValue(of({}));
    gitProviderService.getGitHubRepoList.and.returnValue(of({}));

    dependencyCheckService = createMock(AppLauncherDependencyCheckService);
    dependencyCheckService.getDependencyCheck.and.returnValue(of(mockDepencyCheck));
    dependencyCheckService.getApplicationsInASpace.and.returnValue(of([{attributes: {name: 'app-1'}}]));

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        LauncherModule,
        FeatureFlagModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [
        ImportAppComponent
      ],
      providers: [
        ProjectSummaryService,
        {
          provide: FeatureTogglesService,
          useFactory: () => featureTogglesService,
          deps: []
        },
        {
          provide: PipelineService,
          useFactory: () => pipelineService,
          deps: []
        }, {
          provide: GitProviderService,
          useFactory: () => gitProviderService,
          deps: []
        }, {
          provide: DependencyCheckService,
          useFactory: () => dependencyCheckService,
          deps: []
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should add query params', async(() => {
    component.projectName = 'app-1';
    fixture.detectChanges();
    const query = { 'q': '{\"application\":[\"' + component.projectName + '\"]}'};
    expect(component.addQuery()).toEqual(query);
  }));
});
