import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';

import {
  WizardComponent, WizardConfig, WizardStepConfig, WizardEvent, WizardStep,
  WizardStepComponent
} from 'patternfly-ng';
import { ForgeService } from 'app/space/forge-wizard/forge.service';
import { Gui, Input, MetaData } from 'app/space/forge-wizard/gui.model';
import { History } from 'app/space/forge-wizard/history.component';
import { AnalyzeOverviewComponent } from 'app/space/analyze/analyze-overview/analyze-overview.component';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CodebasesService } from '../create/codebases/services/codebases.service';
import { Codebase } from '../create/codebases/services/codebase';
import { ContextService } from '../../shared/context.service';
import { Context, Space } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Rx';
import { NotificationType, Notification, Notifications } from 'ngx-base';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'forge-wizard',
  templateUrl: './forge-wizard.component.html',
  styleUrls: ['./forge-wizard.component.less']
})
export class ForgeWizardComponent implements OnInit {
  @ViewChild('wizard') wizard: WizardComponent;
  form: FormGroup = new FormGroup({});
  stepCode: WizardStepConfig;
  stepDeployment: WizardStepConfig;
  stepReview: WizardStepConfig;
  stepGithubImportPickOrganisation: WizardStepConfig;
  stepGithubRepositories: WizardStepConfig;
  stepConfigurePipeline: WizardStepConfig;
  stepCreateBuildConfig: WizardStepConfig;
  stepReviewConfig: WizardStepConfig;
  config: WizardConfig;
  history: History = new History();
  isLoading = true;
  private EXECUTE_STEP_INDEX: number;
  private LAST_STEP: number;
  private result: Input;
  private currentSpace: Space;

  constructor(private parent: AnalyzeOverviewComponent,
              private forgeService: ForgeService,
              private codebasesService: CodebasesService,
              private context: ContextService,
              private notifications: Notifications) {
    this.config = {
      title: 'Application Wizard',
      stepStyleClass: 'wizard'
    } as WizardConfig;
    this.stepCode = {
      id: 'stack',
      priority: 1,
      title: 'Stack and Code'
    } as WizardStepConfig;
    this.stepDeployment = {
      id: 'deployemnt',
      priority: 2,
      title: 'Deployment'
    } as WizardStepConfig;
    this.stepReview = {
      id: 'review',
      priority: 3,
      title: 'Review'
    } as WizardStepConfig;
    this.stepGithubImportPickOrganisation = {
      id: 'GithubImportPickOrganisationStep',
      priority: 1,
      title: 'Github Organisation',
      allowClickNav: false,
      disabled: false
    } as WizardStepConfig;
    this.stepGithubRepositories = {
      id: 'GithubRepositoriesStep',
      priority: 2,
      title: 'Github Repositories',
      allowClickNav: false
    } as WizardStepConfig;
    this.stepConfigurePipeline = {
      id: 'ConfigurePipeline',
      priority: 3,
      title: 'Configure Pipeline',
      allowClickNav: false
    } as WizardStepConfig;
    this.stepCreateBuildConfig = {
      id: 'CreateBuildConfigStep',
      priority: 4,
      title: 'Build Config',
      allowClickNav: false
    } as WizardStepConfig;
    this.stepReviewConfig = {
      id: 'Review',
      priority: 5,
      title: 'Review',
      allowClickNav: false
    } as WizardStepConfig;

    this.EXECUTE_STEP_INDEX = this.stepCreateBuildConfig.priority - 1;
    this.LAST_STEP = this.stepReviewConfig.priority - 1;

    this.context.current.subscribe((ctx: Context) => {
      if (ctx.space) {
        this.currentSpace = ctx.space;
        console.log(`ForgeWizardComponent::The current space has been updated to ${this.currentSpace.attributes.name}`);
      }
    });
  }

  get currentGui(): Gui {
    return this.history.currentGui;
  }

  ngOnInit(): void {
    this.loadUi().then(gui => {
      this.stepGithubImportPickOrganisation.disabled = gui.metadata.name
        === 'io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep';
      this.stepGithubImportPickOrganisation.nextEnabled = true;
      this.wizard.goToStep(0, true);
    });
  }

  cancel($event) {
    this.parent.closeModal($event);
  }

  nextClicked($event: WizardEvent): void {
    if (this.form.valid) {
      if (this.history.stepIndex === this.EXECUTE_STEP_INDEX + 1) { // execute
        this.executeStep(flattenWizardSteps(this.wizard));
      } else if (this.history.stepIndex === this.LAST_STEP + 1) { // addcodebaseStep
        this.addCodebaseStep();
      } else { // init or next
        this.loadUi();
      }
    }
  }

  previousClicked($event: WizardEvent): void {
    // history step index starts at index 1
    this.move(this.history.stepIndex - 1, this.history.stepIndex - 2, flattenWizardSteps(this.wizard));
  }

  stepChanged($event: WizardEvent) {
    const currentStep = this.history.stepIndex;
    const gotoStep = $event.step.config.priority;
    if (currentStep !== this.LAST_STEP + 1 && currentStep > gotoStep) {
      this.move(currentStep - 1, gotoStep - 1, flattenWizardSteps(this.wizard));
    }
  }

  // to, from are zero-based index
  move(from: number, to: number, wizardSteps = this.wizard.steps) {
    let serverSideErrors = null;
    if (to === this.EXECUTE_STEP_INDEX) { // last forge step, change next to finish
      this.wizard.config.nextTitle = 'Finish';
    }
    if (from === this.EXECUTE_STEP_INDEX && from > to) { // moving from finish step to previous, set back next
      this.wizard.config.nextTitle = '> Next';
    }
    if (to === this.LAST_STEP) {
      return;
    }
    if (from > to ) {
      // moving backward, all steps after this one should not be navigable
      wizardSteps.filter(step => step.config.priority > to).map(step => step.config.allowClickNav = false);
    } else {
      // moving forward (only one step at a time with next)
      wizardSteps[from].config.allowClickNav = true;
      if (this.currentGui.messages && this.currentGui.messages.length > 0) {
        // server-side error, go back to previous
        serverSideErrors = this.currentGui.messages.filter(msg => msg.severity === 'ERROR');
        if (!isNullOrUndefined(serverSideErrors)) {
          to = from; // roll back to "from" step
          this.wizard.goToPreviousStep();
        }
      }
    }
    this.history.resetTo(to + 1); // history is 1-based array
    this.history.done();
    if (!isNullOrUndefined(serverSideErrors)) {
      this.currentGui.messages = serverSideErrors;
    }
    this.form = this.buildForm(this.currentGui, wizardSteps[to]); // wizard.steps is 0-based array
    wizardSteps[to].config.nextEnabled = this.form.valid && isNullOrUndefined(this.currentGui.messages);
    this.subscribeFormHistoryUpdate(to, wizardSteps);
  }

  private loadUi(): Promise<Gui> {
    this.isLoading = true;
    return this.forgeService.loadGui('fabric8-import-git', this.history).then((gui: Gui) => {
      let from = this.history.stepIndex;
      this.history.add(gui);
      let to = this.history.stepIndex;
      if (to > 0) {
        to = to - 1;
      }
      if (from > 0) {
        from = from - 1;
      }
      this.move(from, to, flattenWizardSteps(this.wizard));
      this.isLoading = false;
      return gui;
    });
  }

  private subscribeFormHistoryUpdate(index: number, wizardSteps = this.wizard.steps) {
    this.form.valueChanges.subscribe(values => {
      wizardSteps[index].config.nextEnabled = this.form.valid;
      if (!isNullOrUndefined(this.currentGui.messages)) {
        this.currentGui.messages = null;
      }
      this.history.updateFormValues(values);
    });
  }

  private executeStep(wizardSteps = this.wizard.steps): void {
    this.isLoading = true;
    this.wizard.config.nextTitle = 'Ok';
    wizardSteps[this.LAST_STEP].config.nextEnabled = false;
    wizardSteps[this.LAST_STEP].config.previousEnabled = false;
    wizardSteps.map(step => step.config.allowClickNav = false);
    this.forgeService.executeStep('fabric8-import-git', this.history).then((gui: Gui) => {
      this.result = gui[6] as Input;
      let newGui = this.augmentStep(gui);
      this.isLoading = false;
      wizardSteps[this.LAST_STEP].config.nextEnabled = true;
      console.log('Response from execute' + JSON.stringify(gui));
    });
  }

  private addCodebaseDelegate(spaceId: string, code: Codebase): Observable<Codebase> {
    return this.codebasesService.addCodebase(spaceId, code);
  }

  private addCodebaseStep(): void {
    this.isLoading = true;
    let space = this.currentSpace;
    let codebases: Codebase[] = this.convertResultToCodebases(this.result);
    let obs: Observable<Codebase>;
    codebases.forEach(code => {
      if (!obs) {
        obs = this.addCodebaseDelegate(space.id, code);
      } else {
        obs = obs.concat(this.addCodebaseDelegate(space.id, code));
      }
    });
    obs.subscribe(
      codebase => {
        console.log(`Successfully added codebase ${codebase.attributes.url}`);
        // todo broadcast
        // this._broadcaster.broadcast('codebaseAdded', codebase);
        this.notifications.message(<Notification>{
          message: `Your ${codebase.attributes.url} repository has been `
            + `added to the ${this.currentSpace.attributes.name} space`,
          type: NotificationType.SUCCESS
        });
      },
      err => console.log(`Error adding codebase ${err}`),
      () => {
          console.log(`completed`);
          this.isLoading = false;
          // TOOD Display error
          this.parent.closeModal({});
        });
  }

  private augmentStep(gui: Gui) {
    let newGui = this.convertResultToGui(this.result);
    this.history.add(newGui);
    return newGui;
  }

  private convertResultToGui(result: Input): Gui {
    let newGui = new Gui();
    newGui.metadata = {name: 'Review'} as MetaData;
    newGui.inputs = [];
    if (this.result.gitRepositories) {
      this.result.gitRepositories.forEach(repo => {
        let input = {
          label: repo.url,
          name: repo.url,
          valueType: 'java.lang.String',
          enabled: false,
          required: false,
          display: {
            namespace: (this.result as any).namespace,
            buildConfigName: (this.result as any).buildConfigName,
            cheStackId: (this.result as any).cheStackId
            // TODO fix it che stack id should be returned per repo
            // https://github.com/fabric8io/fabric8-generator/issues/54
          }
        } as Input;
        newGui.inputs.push(input);
      });
    }
    return newGui;
  }
  private convertResultToCodebases(result: Input): Codebase[] {
    let codebases: Codebase[] = [];
    if (this.result.gitRepositories) {
      this.result.gitRepositories.forEach(repo => {
        let codebase = {
          attributes: {
            type: 'git',
            url: repo.url,
            stackId: repo.stackId
          },
          type: 'codebases'
        } as Codebase;
        codebases.push(codebase);
      });
    }
    return codebases;
  }
  private buildForm(gui: Gui, to: WizardStep): FormGroup {
    let group: any = {};
    gui.inputs.forEach(sub => {
      let input = sub as Input;
      if (input.required) {
        group[input.name] = new FormControl(input.value || '', Validators.required);
        if (!input.value || input.value === '' || input.value.length === 0) {
          // is empty for single and multiple select input
          to.config.nextEnabled = false;
        }
      } else {
         group[input.name] = new FormControl(input.value || '');
      }
    });

    return new FormGroup(group);
  }
}

export function flattenWizardSteps(wizard: WizardComponent): WizardStep[] {
  let flatWizard: WizardStep[] = [];
  wizard.steps.forEach((step: WizardStepComponent) => {
    if (step.hasSubsteps) {
      step.steps.forEach(substep => {
        flatWizard.push(substep);
      });
    } else {
      flatWizard.push(step);
    }
  });
  return flatWizard;
}
