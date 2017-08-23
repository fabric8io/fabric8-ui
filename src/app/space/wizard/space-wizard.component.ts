import { Component, Input, OnInit, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ILoggerDelegate, LoggerFactory } from './common/logger';
import { IWorkflow, WorkflowFactory } from './models/workflow';
import { AppGeneratorConfiguratorService } from './services/app-generator.service';
import { WorkflowStep } from "app/space/wizard/models/workflow-step";
import { WizardComponent, WizardConfig, WizardEvent, WizardStepConfig } from 'patternfly-ng';

@Component({
  selector: 'space-wizard',
  templateUrl: './space-wizard.component.html',
  styleUrls: ['./space-wizard.component.less']
})
export class SpaceWizardComponent implements OnInit, AfterViewInit {
 @ViewChild('wizard') wizard: WizardComponent;

  static instanceCount: number = 1;
  spaceWizardConfig: WizardConfig;
  step1SpaceCreation: WizardStepConfig;
  step2SpaceConfigurator: WizardStepConfig;
  step3Quickstart: WizardStepConfig;
  step3bisImportRepo: WizardStepConfig;

  @Input() stepIndex: string;
  @Output('onCancel') onCancel = new EventEmitter();

  constructor(
    private router: Router,
    loggerFactory: LoggerFactory,
    public configurator: AppGeneratorConfiguratorService
  ) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, SpaceWizardComponent.instanceCount++);
    if (logger) {
      this.log = logger;
    }
    this.log(`New instance ...`);

  }

  ngOnInit() {
    this.log(`ngInit ...`);
    ///// Wizard
    this.spaceWizardConfig = {
      hideSidebar: true,
      hideIndicators: true,
      stepStyleClass: "wizard-step",
      nextTitle: "Create"
    } as WizardConfig;

    this.step1SpaceCreation = {
      id: 'step1',
      priority: 0,
      title: 'Space creation'
    } as WizardStepConfig;
    this.step2SpaceConfigurator = {
      id: 'step2',
      priority: 1,
      title: 'Space configuration'
    } as WizardStepConfig;
    this.step3Quickstart = {
      id: 'step3',
      priority: 2,
      title: 'Quickstart'
    } as WizardStepConfig;
    this.step3bisImportRepo = {
      id: 'step4',
      priority: 3,
      title: 'Import github repository'
    } as WizardStepConfig;
    ///// Wizard
  }

  ngAfterViewInit() {
    // wrap inside timoput to workaround exception: expression has changed after it was checked.
    // see https://github.com/angular/angular/issues/6005
    window.setTimeout(() => {
      if (this.stepIndex && this.stepIndex == "space-configurator-step") {
        // change the first step of the wizard after all childview are initialized.
        this.wizard.goToStep(1, true);
        this.wizard.config.title = `Welcome to your ${this.configurator.currentSpace.attributes.name} space.`;
        // this.wizard.config.hideFooter = true; TODO wizard: once PR merged and released
      } else {
        this.wizard.config.title = `Create Space`;
      }
    })
  }
  /**
   * Resets the configurator, space and workflow object
   * into a default empty state.
   */
  reset() {
    this.configurator.resetTransientSpace();

  }

  finish() {
    this.log(`finish (in finish)...`);
    // navigate to the users space
    this.router.navigate([
      this.configurator.currentSpace.relationalData.creator.attributes.username,
      this.configurator.currentSpace.attributes.name
    ]);
  }

  cancel() {
    this.log(`cancel from space-wizard...`);
    this.onCancel.emit({});
  }

  /**
   * used to add a log entry to the logger
   * The default one shown here does nothing.
   */
  log: ILoggerDelegate = () => { };

}
