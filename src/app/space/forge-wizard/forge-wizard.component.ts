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
      allowClickNav: false
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
    console.log("valid?", this.form.valid);
    if (this.form.valid) {
      this.history.resetTo(this.history.stepIndex);
      this.loadUi();
    }
  }

  previousClicked($event: WizardEvent): void {
    this.wizard.steps[this.history.stepIndex - 1].config.allowClickNav = false; // current state is navigable
    this.history.resetTo(this.history.stepIndex - 1);
    this.history.done();
    this.form = this.buildForm(this.currentGui);
  }

  stepChanged($event: WizardEvent) {
    const currentStep = this.history.stepIndex;
    const stepName = $event.step.config.id;
    const gotoStep = $event.step.config.priority;
    if (currentStep > gotoStep) {
      this.history.resetTo(gotoStep);
      this.history.done();
      this.wizard.steps.filter(step => step.config.priority > gotoStep).map(step => step.config.allowClickNav = false);
      this.form = this.buildForm(this.currentGui);
    }
  }

  private loadUi(): void {
    this.forgeService.loadGui('fabric8-import-git', this.history).then((gui: Gui) => {
      if (this.history.stepIndex > 0) {
        this.wizard.steps[this.history.stepIndex - 1].config.allowClickNav = true; // step number icon is clickable
      }
      this.history.add(gui);
      this.history.done();

      this.form = this.buildForm(gui);

      //don't know about this it would be better to use the form
      //instead of history.convert or use the form for history.convert
      this.form.valueChanges.subscribe(values => {
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
}
