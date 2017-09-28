import {Component, OnInit} from '@angular/core';
import {WizardConfig, WizardStepConfig} from 'patternfly-ng';
import {ForgeService} from './forge.service';
import {History} from './history.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'forge-quickstart',
  templateUrl: './forge-quickstart.component.html'
})
export class ForgeQuickstartComponent implements OnInit {
  private config: WizardConfig;
  private steps: WizardStepConfig[] = [];
  private history: History = new History();
  private form: FormGroup = new FormGroup({});

  constructor(private forgeService: ForgeService) {
    this.config = {
      title: 'Quickstart Wizard',
      stepStyleClass: 'wizard'
    } as WizardConfig;

    this.steps[0] = {title: 'Choose a quickstart', priority: 0} as WizardStepConfig;
  }

  ngOnInit(): void {
    let group: any = {};
    this.forgeService.loadGui('fabric8-new-project', this.history).then(gui => {
      this.history.add(gui);
      gui.inputs.forEach(input => {
        group[input.name] = input.required ? new FormControl(input.value || '', Validators.required) :
          new FormControl(input.value || '');
      });

      this.form = new FormGroup(group);
      this.history.done();
    });
  }
}
