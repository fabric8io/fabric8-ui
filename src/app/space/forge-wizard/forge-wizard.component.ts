
import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';

import { WizardComponent, WizardConfig, WizardStepConfig, WizardEvent } from 'patternfly-ng';
import { ForgeService } from "app/space/forge-wizard/forge.service";
import { Gui, Input } from "app/space/forge-wizard/gui.model";
import { History } from "app/space/forge-wizard/history.component";

@Component({
  selector: 'forge-wizard',
  templateUrl: './forge-wizard.component.html',
  styleUrls: ['./forge-wizard.component.less']
})
export class ForgeWizardComponent implements OnInit {
  @ViewChild('wizard') wizard: WizardComponent;
  step1Config: WizardStepConfig;
  config: WizardConfig;
  history: History = new History();

  description: string;

  constructor(private forgeService: ForgeService) {
    this.description = "TEST";
    this.step1Config = {
      id: 'step1',
      priority: 0,
      title: 'First Step'
    } as WizardStepConfig;
  }

  ngOnInit(): void {
    this.config = {
      title: 'Wizard Title',
      sidebarStyleClass: 'example-wizard-sidebar',
      stepStyleClass: 'example-wizard-step'
    } as WizardConfig;

    this.forgeService.loadGui('fabric8-import-git', this.history).then((gui: Gui) => {
      this.history.add(gui);
      this.history.done();

      // Step 1
      this.step1Config = {
        id: this.history.currentGui.metadata.name,
        priority: 0,
        title: this.history.currentGui.metadata.name
      } as WizardStepConfig;
      // Wizard
    });
  }
  cancel() {
    //TODO
  }

  nextClicked($event: WizardEvent): void {
    this.forgeService.loadGui('fabric8-import-git', this.history);
  }
}
