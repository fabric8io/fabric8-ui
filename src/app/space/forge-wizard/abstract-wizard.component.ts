
import { EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { WizardComponent, WizardConfig, WizardStep, WizardStepComponent, WizardStepConfig } from 'patternfly-ng';
import {History} from 'app/space/forge-wizard/history.component';
import {Gui, Input} from './gui.model';
import { ContextService } from '../../shared/context.service';
import { Context, Space } from 'ngx-fabric8-wit';


export class AbstractWizard implements OnInit {
  @ViewChild('wizard') wizard: WizardComponent;

  form: FormGroup = new FormGroup({});
  history: History = new History();
  config: WizardConfig;
  steps: WizardStepConfig[];
  currentSpace: Space;
  isLoading = true;
  EXECUTE_STEP_INDEX: number;
  LAST_STEP: number;
  @Output('onCancel') onCancel = new EventEmitter();

  constructor(public context: ContextService) {
    this.steps = [];
    this.config = {
      title: 'Application Wizard',
      stepStyleClass: 'wizard'
    } as WizardConfig;
    this.context.current.subscribe((ctx: Context) => {
      if (ctx.space) {
        this.currentSpace = ctx.space;
        console.log(`ForgeWizardComponent::The current space has been updated to ${this.currentSpace.attributes.name}`);
      }
    });
  }

  ngOnInit(): void {
  }

  get currentGui(): Gui {
    return this.history.currentGui;
  }

  cancel($event) {
    this.onCancel.emit($event);
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
        to.config.nextEnabled = true;
      }
    });

    return new FormGroup(group);
  }
}

export function flattenWizardSteps(wizard: WizardComponent): WizardStep[] {
  let flatWizard: WizardStep[] = [];
  wizard.steps.forEach((step: WizardStepComponent) => {
    if (step.hasSubsteps) {
      step.steps.forEach(substep => {
        flatWizard.push(substep);
      });
    } else {
      flatWizard.push(step);
    }
  });
  return flatWizard;
}
