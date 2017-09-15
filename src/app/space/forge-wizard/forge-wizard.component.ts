import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';

import { WizardComponent, WizardConfig, WizardStepConfig, WizardEvent } from 'patternfly-ng';
import { ForgeService } from "app/space/forge-wizard/forge.service";
import { Gui, Input } from "app/space/forge-wizard/gui.model";
import { History } from "app/space/forge-wizard/history.component";
import { AnalyzeOverviewComponent } from "app/space/analyze/analyze-overview/analyze-overview.component";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'forge-wizard',
  templateUrl: './forge-wizard.component.html',
  styleUrls: ['./forge-wizard.component.less']
})
export class ForgeWizardComponent implements OnInit {
  @ViewChild('wizard') wizard: WizardComponent;
  @ViewChild('form') form: NgForm;
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
  }

  stepChanged($event: WizardEvent) {
    const currentStep = this.history.stepIndex;
    const stepName = $event.step.config.id;
    const gotoStep = $event.step.config.priority;
    if (currentStep > gotoStep) {
      this.history.resetTo(gotoStep);
      this.history.done();
      this.wizard.steps.filter(step => step.config.priority > gotoStep).map(step => step.config.allowClickNav = false);
    }
  }

  private loadUi(): void {
    this.forgeService.loadGui('fabric8-import-git', this.history).then((gui: Gui) => {
      if (this.history.stepIndex > 0) {
        this.wizard.steps[this.history.stepIndex - 1].config.allowClickNav = true; // step number icon is clickable
      }
      this.history.add(gui);
      this.history.done();
    });
  }

}
