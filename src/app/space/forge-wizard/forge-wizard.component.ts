import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';

import { WizardComponent, WizardConfig, WizardStepConfig, WizardEvent, WizardStep } from 'patternfly-ng';
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

@Component({
  selector: 'forge-wizard',
  templateUrl: './forge-wizard.component.html',
  styleUrls: ['./forge-wizard.component.less']
})
export class ForgeWizardComponent implements OnInit {
  @ViewChild('wizard') wizard: WizardComponent;
  form: FormGroup = new FormGroup({});
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
      title: 'Import booster',
      stepStyleClass: 'wizard'
    } as WizardConfig;

    this.stepGithubImportPickOrganisation = {
      id: 'GithubImportPickOrganisationStep',
      priority: 1,
      title: 'Github Organisation',
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;
    this.stepGithubRepositories = {
      id: 'GithubRepositoriesStep',
      priority: 2,
      title: 'Github Repositories',
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;
    this.stepConfigurePipeline = {
      id: 'ConfigurePipeline',
      priority: 3,
      title: 'Configure Pipeline',
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;
    this.stepCreateBuildConfig = {
      id: 'CreateBuildConfigStep',
      priority: 4,
      title: 'Build Config',
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;
    this.stepReviewConfig = {
      id: 'Review',
      priority: 5,
      title: 'Review',
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;

    this.EXECUTE_STEP_INDEX = this.stepCreateBuildConfig.priority;
    this.LAST_STEP = this.stepReviewConfig.priority;

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

  toggleDropdown(): void {
    this.currentGui.inputs[0].name += '!';
    console.log(this.currentGui.inputs[0].name);
  }

  ngOnInit(): void {
    this.loadUi();
  }

  cancel($event) {
    this.parent.closeModal($event);
  }

  nextClicked($event: WizardEvent): void {
    if (this.form.valid) {
      if (this.history.stepIndex === this.EXECUTE_STEP_INDEX) { // execute
        this.executeStep();
      } else if (this.history.stepIndex === this.LAST_STEP) { // addcodebaseStep
        this.addCodebaseStep();
      } else { // init or next
        this.loadUi();
      }
    }
  }

  previousClicked($event: WizardEvent): void {
    this.move(this.history.stepIndex, this.history.stepIndex - 1);
  }

  stepChanged($event: WizardEvent) {
    const currentStep = this.history.stepIndex;
    const stepName = $event.step.config.id;
    const gotoStep = $event.step.config.priority;
    if (currentStep !== this.LAST_STEP && currentStep > gotoStep) {
      this.move(currentStep, gotoStep);
    }
  }

  move(from: number, to: number) {
    if (from > to ) { // moving backward, all steps after this one should not be navigable
      this.wizard.steps.filter(step => step.config.priority > to).map(step => step.config.allowClickNav = false);
      //this.wizard.steps[to].config.nextEnabled = true;
      if (to !== this.LAST_STEP) { // no form for last step
        this.history.resetTo(to);
        this.history.done();
        this.form = this.buildForm(this.currentGui, this.wizard.steps[to]);
        this.wizard.steps[to].config.nextEnabled = this.form.valid;
      }
    } else { // moving forward (only one step at a time with next)
      this.wizard.steps[from].config.allowClickNav = true;
      //this.wizard.steps[from].config.nextEnabled = true;//this.form.valid;
      if (to !== this.LAST_STEP) { // no form for last step
        this.history.resetTo(to);
        this.history.done();
        this.form = this.buildForm(this.currentGui, this.wizard.steps[from]);
        this.wizard.steps[from].config.nextEnabled = this.form.valid;
      }
    }
    if (to === this.EXECUTE_STEP_INDEX) { // last forge step, change next to finsih
      this.wizard.config.nextTitle = 'Finish';
    }
    if (from === this.EXECUTE_STEP_INDEX && from > to) { // moving from finish step to previous, set back next
      this.wizard.config.nextTitle = '> Next';
    }
  }

  private loadUi(): void {
    this.isLoading = true;
    this.forgeService.loadGui('fabric8-import-git', this.history).then((gui: Gui) => {
      this.history.add(gui);
      let from = this.history.stepIndex;
      if (this.history.stepIndex > 0) {
        from = this.history.stepIndex - 1;
      }
      this.move(from, this.history.stepIndex);
      this.isLoading = false;

      //don't know about this it would be better to use the form
      //instead of history.convert or use the form for history.convert
      this.form.valueChanges.subscribe(values => {
        this.wizard.steps[from].config.nextEnabled = this.form.valid;
        this.currentGui.inputs.forEach(input => {
          Object.keys(values).forEach(key => {
            if (input.name === key) {
              input.value = values[key];
            }
          });
        });
      });
    });
  }

  private executeStep(): void {
    this.isLoading = true;
    this.wizard.config.nextTitle = 'Ok';
    this.wizard.steps[this.LAST_STEP - 1].config.nextEnabled = false;
    this.wizard.steps[this.LAST_STEP - 1].config.previousEnabled = false;
    this.wizard.steps.map(step => step.config.allowClickNav = false);
    this.forgeService.executeStep('fabric8-import-git', this.history).then((gui: Gui) => {
      this.result = gui[6] as Input;
      let newGui = this.augmentStep(gui);
      this.isLoading = false;
      this.wizard.steps[this.LAST_STEP - 1].config.nextEnabled = true;
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
          message: `Your ${codebase.attributes.url} repository has been added to the ${this.currentSpace.attributes.name} space`,
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
          required: false
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
        if (!input.value || input.value === '' || input.value.length === 0) { // is empty for single and multiple select input
          to.config.nextEnabled = false;
        }
      } else {
         group[input.name] = new FormControl(input.value || '');
      }
    });

    return new FormGroup(group);
  }
}
