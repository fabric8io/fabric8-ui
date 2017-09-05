
import {Component, Input, OnInit, OnDestroy, ViewChild} from '@angular/core';

import {WizardComponent, WizardConfig, WizardStepConfig} from 'patternfly-ng';

@Component({
  selector: 'forge-wizard',
  templateUrl: './forge-wizard.component.html',
  styleUrls: ['./forge-wizard.component.less']
})
export class ForgeWizardComponent implements OnInit {
  @ViewChild('wizard') wizard: WizardComponent;
  step1Config: WizardStepConfig;
  config: WizardConfig;

  description: string;

  constructor() {
    this.description = "TEST";
    this.step1Config = {
      id: 'step1',
      priority: 0,
      title: 'First Step'
    } as WizardStepConfig;
  }

  ngOnInit(): void {
    // Step 1
    this.step1Config = {
      id: 'step1',
      priority: 0,
      title: 'First Step'
    } as WizardStepConfig;
    // Wizard

    this.config = {
      title: 'Wizard Title',
      sidebarStyleClass: 'example-wizard-sidebar',
      stepStyleClass: 'example-wizard-step'
    } as WizardConfig;
  }
  cancel() {
    //TODO
  }
}
