import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';

import { WizardComponent, WizardConfig, WizardStepConfig, WizardEvent } from 'patternfly-ng';
import { ForgeService } from "app/space/forge-wizard/forge.service";
import { Gui, Input } from "app/space/forge-wizard/gui.model";
import { History } from "app/space/forge-wizard/history.component";
import { AnalyzeOverviewComponent } from "app/space/analyze/analyze-overview/analyze-overview.component";
import { NgForm, FormControl, Validators, FormGroup, FormArray } from "@angular/forms";

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
  config: WizardConfig;
  history: History = new History();

  constructor(private parent: AnalyzeOverviewComponent, private forgeService: ForgeService) {
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
  }

  get currentGui(): Gui {
    return this.history.currentGui;
  }

  toggleDropdown(): void {
    this.currentGui.inputs[0].name += "!";
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
      this.loadUi();
    }
  }

  previousClicked($event: WizardEvent): void {
    this.move(this.history.stepIndex, this.history.stepIndex - 1);
  }

  stepChanged($event: WizardEvent) {
    const currentStep = this.history.stepIndex;
    const stepName = $event.step.config.id;
    const gotoStep = $event.step.config.priority;
    if (currentStep > gotoStep) {
      this.move(currentStep, gotoStep);
    }
  }

  private loadUi(): void {
    this.forgeService.loadGui('fabric8-import-git', this.history).then((gui: Gui) => {
      this.history.add(gui);
      let from = this.history.stepIndex;
      if (this.history.stepIndex > 0) {
        from = this.history.stepIndex - 1;
      }
      this.move(from, this.history.stepIndex);

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

  private buildForm(gui: Gui): FormGroup {
    let group: any = {};
    gui.inputs.forEach(sub => {
      let input = sub as Input;
      group[input.name] = input.required ? new FormControl(input.value || '', Validators.required)
          : new FormControl(input.value || '');
    });

    return new FormGroup(group);
  }

  private move(from: number, to: number) {
    if (from > to ) { // moving backward, all steps aftershould not be naavigable
      this.wizard.steps.filter(step => step.config.priority > to).map(step => step.config.allowClickNav = false);
    } else { // moving forward (only one step at a time with next)
      this.wizard.steps[from].config.allowClickNav = true;
    }
    this.wizard.steps[from].config.nextEnabled = this.form.valid;
    this.history.resetTo(to);
    this.history.done();
    this.form = this.buildForm(this.currentGui);
  }

}
