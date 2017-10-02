import {Component} from '@angular/core';
import {WizardConfig, WizardStepConfig} from 'patternfly-ng';
import {ForgeService} from './forge.service';
import {AbstractWizard} from './abstract-wizard.component';
import { ContextService } from '../../shared/context.service';
import { Gui } from './gui.model';
import { configureSteps } from './quickstart-wizard.config';

@Component({
  selector: 'quickstart-wizard',
  templateUrl: './quickstart-wizard.component.html'
})
export class ForgeQuickstartComponent extends AbstractWizard {

  constructor(forgeService: ForgeService, context: ContextService) {
    super(forgeService, context);
    this.endNextPoint = 'fabric8-new-project';
    this.steps = configureSteps();
    this.isLoading = true;
    this.EXECUTE_STEP_INDEX = this.steps[6].priority - 1;
    this.LAST_STEP = this.steps[7].priority - 1;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadUi().then(gui => {
      this.steps[3].nextEnabled = true;
      this.isLoading = false;
    });
  }

  executeStep(wizardSteps = this.wizard.steps): void {
    this.isLoading = true;
    this.wizard.config.nextTitle = 'Ok';
    wizardSteps[this.LAST_STEP].config.nextEnabled = false;
    wizardSteps[this.LAST_STEP].config.previousEnabled = false;
    wizardSteps.map(step => step.config.allowClickNav = false);
    this.forgeService.executeStep('fabric8-import-git', this.history).then((gui: Gui) => {
      // this.result = gui[6] as Input;
      // let newGui = this.augmentStep(gui);
      // this.isLoading = false;
      // wizardSteps[this.LAST_STEP].config.nextEnabled = true;
      console.log('ForgeQuickstartComponent::execute - response: ' + JSON.stringify(gui));
    });
  }

  reviewStep(): void {
  // TODO
  }
}
