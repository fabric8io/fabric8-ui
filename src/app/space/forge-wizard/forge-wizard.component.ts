
import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';

import { WizardComponent, WizardConfig, WizardStepConfig, WizardEvent } from 'patternfly-ng';
import { ForgeService } from "app/space/forge-wizard/forge.service";
import { Gui, Input } from "app/space/forge-wizard/gui.model";
import { History } from "app/space/forge-wizard/history.component";
import { AnalyzeOverviewComponent } from "app/space/analyze/analyze-overview/analyze-overview.component";

@Component({
  selector: 'forge-wizard',
  templateUrl: './forge-wizard.component.html',
  styleUrls: ['./forge-wizard.component.less']
})
export class ForgeWizardComponent implements OnInit {
  @ViewChild('wizard') wizard: WizardComponent;
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
      priority: 0,
      title: 'Github Organisation'
    } as WizardStepConfig;
    this.stepGithubRepositories = {
      id: 'GithubRepositoriesStep',
      priority: 1,
      title: 'Github Repositories'
    } as WizardStepConfig;
    this.stepConfigurePipeline = {
      id: 'ConfigurePipeline',
      priority: 3,
      title: 'Configure Pipeline'
    } as WizardStepConfig;
    this.stepCreateBuildConfig = {
      id: 'CreateBuildConfigStep',
      priority: 3,
      title: 'Build Config'
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
    this.history.resetTo(this.history.stepIndex);
    this.loadUi();
  }

  private loadUi(): void {
    this.forgeService.loadGui('fabric8-import-git', this.history).then((gui: Gui) => {
      this.history.add(gui);
      this.history.done();
    });
  }

  previousClicked($event: WizardEvent): void {
    this.history.resetTo(this.history.stepIndex - 1);
    this.history.done();
  }
}
