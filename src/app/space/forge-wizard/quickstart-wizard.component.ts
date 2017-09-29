import {Component} from '@angular/core';
import {WizardConfig, WizardStepConfig} from 'patternfly-ng';
import {ForgeService} from './forge.service';
import {AbstractWizard} from './abstract-wizard.component';
import { ContextService } from '../../shared/context.service';

@Component({
  selector: 'quickstart-wizard',
  templateUrl: './quickstart-wizard.component.html'
})
export class ForgeQuickstartComponent extends AbstractWizard {

  constructor(private forgeService: ForgeService, context: ContextService) {
    super(context);
    this.steps[0] = {title: 'Choose a quickstart', priority: 0} as WizardStepConfig;
  }

  ngOnInit(): void {
    this.forgeService.loadGui('fabric8-new-project', this.history).then(gui => {
      this.history.add(gui);

      this.form = this.buildForm(gui, this.wizard.steps[0]);
      this.history.done();
    });
  }
}
