import { CodebasesAddComponent } from './codebases-add.component';
import { Contexts } from 'ngx-fabric8-wit';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { ForgeImportWizardComponent } from './import-wizard.component';
import { ContextsMock } from '../create/codebases/services/github.service.mock';
import { ForgeService } from './forge.service';
import { AnalyzeOverviewComponent } from '../analyze/analyze-overview/analyze-overview.component';
import { CodebasesService } from '../create/codebases/services/codebases.service';
import { ContextService } from '../../shared/context.service';
import { Gui } from './gui.model';
import { gui } from './forge.service.mock';
import { WizardComponent, WizardConfig, WizardStep, WizardStepComponent, WizardStepConfig } from 'patternfly-ng';
import { Notifications } from 'ngx-base';
import { getParentStep, flattenWizardSteps } from './abstract-wizard.component';

describe('Forge wizard component:', () => {

  let parentComponentMock: any;
  let codebasesServiceMock: any;
  let notificationMock: any;
  let contextsMock: any;
  let forgeServiceMock: any;
  let fixture;

  beforeEach(() => {
    codebasesServiceMock = jasmine.createSpyObj('CodebasesService', ['getCodebases', 'addCodebase']);
    contextsMock = jasmine.createSpy('Contexts');
    notificationMock = jasmine.createSpyObj('Notifications', ['message']);
    forgeServiceMock = jasmine.createSpyObj('ForgeService', ['loadGui']);
    parentComponentMock = jasmine.createSpy('AnalyzeOverviewComponent');

    TestBed.configureTestingModule({
      imports: [HttpModule],
      declarations: [ForgeImportWizardComponent],
      providers: [
        {
          provide: AnalyzeOverviewComponent, useValue: parentComponentMock
        },
        {
          provide: CodebasesService, useValue: codebasesServiceMock
        },
        {
          provide: ContextService, useClass: ContextsMock
        },
        {
          provide: Notifications, useValue: notificationMock
        },
        {
           provide: ForgeService, useValue: forgeServiceMock
        }
      ],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });
    let p = new Promise<Gui>((resolve, reject) => {
      resolve(gui);
    });
    forgeServiceMock.loadGui.and.returnValue(p);
    fixture = TestBed.createComponent(ForgeImportWizardComponent);
  });

  it('Init component successfully', async(() => {
    // given
    const comp = fixture.componentInstance;
    spyOn(comp, 'move').and.callFake(function() {});
    const debug = fixture.debugElement;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(comp.history.state[0].inputs[0].name).toEqual('gitOrganisation');
      expect(comp.history.state[0].inputs[0].class).toEqual('UISelectOne');
      expect(comp.history.state[0].inputs[0].value).toEqual('corinnekrych');
    });
  }));
});

describe('Forge wizard logic:', () => {
  let wizard: WizardComponent;
  let config: WizardConfig;
  let stepGithubImportPickOrganisationConfig: WizardStepConfig;
  let stepGithubImportPickOrganisation: WizardStep;
  let stepGithubRepositoriesConfig: WizardStepConfig;
  let stepGithubRepositories: WizardStep;
  let stepConfigurePipelineConfig: WizardStepConfig;
  let stepConfigurePipeline: WizardStep;
  let stepCreateBuildConfig: WizardStepConfig;
  let stepCreateBuild: WizardStep;
  let stepReviewConfig: WizardStepConfig;
  let stepReview: WizardStep;

  beforeEach(() => {
    wizard = new WizardComponent();
    config = {
      title: 'Application Wizard',
      stepStyleClass: 'wizard'
    } as WizardConfig;
    wizard.config = config;
    stepGithubImportPickOrganisationConfig = {
      id: 'GithubImportPickOrganisationStep',
      priority: 1,
      title: 'Github Organisation',
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;
    stepGithubImportPickOrganisation = {
      config: stepGithubImportPickOrganisationConfig
    } as WizardStep;
    stepGithubRepositoriesConfig = {
      id: 'GithubRepositoriesStep',
      priority: 2,
      title: 'Github Repositories',
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;
    stepGithubRepositories = {
      config: stepGithubRepositoriesConfig
    } as WizardStep;
    stepConfigurePipelineConfig = {
      id: 'ConfigurePipeline',
      priority: 3,
      title: 'Configure Pipeline',
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;
    stepConfigurePipeline = {
      config: stepConfigurePipelineConfig
    } as WizardStep;
    stepCreateBuildConfig = {
      id: 'CreateBuildConfigStep',
      priority: 4,
      title: 'Build Config',
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;
    stepCreateBuild = {
      config: stepCreateBuildConfig
    } as WizardStep;
    stepReviewConfig = {
      id: 'Review',
      priority: 5,
      title: 'Review',
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;
    stepReview = {
      config: stepReviewConfig
    } as WizardStep;
  });

  it('Flatten wizard return steps unchanged when no sustep are used', async(() => {
    // given
    wizard.addStep(stepGithubImportPickOrganisation);
    wizard.addStep(stepGithubRepositories);
    wizard.addStep(stepConfigurePipeline);
    wizard.addStep(stepCreateBuild);
    wizard.addStep(stepReview);
    wizard.config.done = true;
    const allSteps = wizard.steps;
    // when
    let flatWizardSteps = flattenWizardSteps(wizard);
    expect(flatWizardSteps).toEqual(wizard.steps);
  }));

  it('Flatten wizard return steps unchanged when no sustep are used', async(() => {
    // given
    let step1Config = {
      id: 'Step1',
      priority: 1,
      title: 'Stack and Code',
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;
    let step1 = new WizardStepComponent(wizard);
    step1.config = step1Config;
    let step2Config = {
      id: 'Step2',
      priority: 2,
      title: 'Deployment',
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;
    let step2 = new WizardStepComponent(wizard);
    step2.config = step2Config;
    let step3Config = {
      id: 'Step3',
      priority: 2,
      title: 'Progress',
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;
    let step3 = new WizardStepComponent(wizard);
    step3.config = step3Config;
    wizard.addStep(step1);
    wizard.addStep(step2);
    wizard.addStep(step3);
    // Add substeps
    step1.addStep(stepGithubImportPickOrganisation);
    step1.addStep(stepGithubRepositories);
    step2.addStep(stepConfigurePipeline);
    step2.addStep(stepCreateBuild);
    step3.addStep(stepReview);
    wizard.config.done = true;
    const allSteps = wizard.steps;
    // when
    let flatWizardSteps = flattenWizardSteps(wizard);
    expect(flatWizardSteps).toEqual([
      stepGithubImportPickOrganisation,
      stepGithubRepositories,
      stepConfigurePipeline,
      stepCreateBuild,
      stepReview
    ]);
  }));

  it('GetParent return the aprent step of a sub step', async(() => {
    // given
    let step1Config = {
      id: 'Step1',
      priority: 1,
      title: 'Stack and Code',
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;
    let step1 = new WizardStepComponent(wizard);
    step1.config = step1Config;
    let step2Config = {
      id: 'Step2',
      priority: 2,
      title: 'Deployment',
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;
    let step2 = new WizardStepComponent(wizard);
    step2.config = step2Config;
    let step3Config = {
      id: 'Step3',
      priority: 2,
      title: 'Progress',
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;
    let step3 = new WizardStepComponent(wizard);
    step3.config = step3Config;
    wizard.addStep(step1);
    wizard.addStep(step2);
    wizard.addStep(step3);
    // Add substeps
    step1.addStep(stepGithubImportPickOrganisation);
    step1.addStep(stepGithubRepositories);
    step2.addStep(stepConfigurePipeline);
    step2.addStep(stepCreateBuild);
    step3.addStep(stepReview);
    wizard.config.done = true;
    const allSteps = wizard.steps;
    // when
    let parent = getParentStep(wizard.steps, stepConfigurePipeline);
    expect(parent).toEqual(step2);
  }));
});

