
import {OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {WizardComponent, WizardConfig, WizardStep, WizardStepConfig} from 'patternfly-ng';
import {History} from 'app/space/forge-wizard/history.component';
import {Gui, Input} from './gui.model';


export class AbstractWizard implements OnInit {
  @ViewChild('wizard') wizard: WizardComponent;

  form: FormGroup = new FormGroup({});
  history: History = new History();

  config: WizardConfig;
  steps: WizardStepConfig[] = [];

  isLoading = true;

  ngOnInit(): void {
  }

  get currentGui(): Gui {
    return this.history.currentGui;
  }

  protected buildForm(gui: Gui, to: WizardStep): FormGroup {
    let group: any = {};
    gui.inputs.forEach(sub => {
      let input = sub as Input;
      if (input.required) {
        group[input.name] = new FormControl(input.value || '', Validators.required);
        if (!input.value || input.value === '' || input.value.length === 0) {
          // is empty for single and multiple select input
          to.config.nextEnabled = false;
        }
      } else {
        group[input.name] = new FormControl(input.value || '');
      }
    });

    return new FormGroup(group);
  }
}
