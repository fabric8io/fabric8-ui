
import { EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  WizardComponent, WizardConfig, WizardEvent, WizardStep, WizardStepComponent,
  WizardStepConfig
} from 'patternfly-ng';
import {History} from 'app/space/forge-wizard/history.component';
import {Gui, Input} from './gui.model';
import { ContextService } from '../../shared/context.service';
import { Context, Space } from 'ngx-fabric8-wit';
import { isNullOrUndefined } from 'util';
import { ForgeService } from './forge.service';

export abstract class AbstractWizard implements OnInit {
  @ViewChild('wizard') wizard: WizardComponent;

  form: FormGroup = new FormGroup({});
  history: History = new History();
  config: WizardConfig;
  steps: WizardStepConfig[];
  currentSpace: Space;
  isLoading = true;
  endNextPoint: string;
  EXECUTE_STEP_INDEX: number;
  LAST_STEP: number;
  @Output('onCancel') onCancel = new EventEmitter();

  constructor(public forgeService: ForgeService,
              public context: ContextService) {
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

  abstract executeStep(steps: WizardStep[]);
  abstract reviewStep();

  nextClicked($event: WizardEvent): void {
    if (this.history.stepIndex === this.EXECUTE_STEP_INDEX + 1) { // execute
      this.executeStep(flattenWizardSteps(this.wizard));
    } else if (this.history.stepIndex === this.LAST_STEP + 1) { // addcodebaseStep
      this.reviewStep();
    } else { // init or next
      this.loadUi();
    }
  }

  previousClicked($event: WizardEvent): void {
    // history step index starts at index 1
    this.move(this.history.stepIndex - 1, this.history.stepIndex - 2, flattenWizardSteps(this.wizard));
  }

  stepChanged($event: WizardEvent) {
    const currentStep = this.history.stepIndex;
    const gotoStep = $event.step.config.priority;
    if (currentStep !== this.LAST_STEP + 1 && currentStep > gotoStep) {
      this.move(currentStep - 1, gotoStep - 1, flattenWizardSteps(this.wizard));
    }
  }

  // to, from are zero-based index
  move(from: number, to: number, wizardSteps = this.wizard.steps) {
    let serverSideErrors = null;
    if (to === this.EXECUTE_STEP_INDEX) { // last forge step, change next to finish
      this.wizard.config.nextTitle = 'Finish';
    }
    if (from === this.EXECUTE_STEP_INDEX && from > to) { // moving from finish step to previous, set back next
      this.wizard.config.nextTitle = '> Next';
    }
    if (to === this.LAST_STEP) {
      return;
    }
    if (from > to ) {
      // moving backward, all steps after this one should not be navigable
      wizardSteps.filter(step => step.config.priority > to).map(step => step.config.allowClickNav = false);
    } else {
      // moving forward (only one step at a time with next)
      wizardSteps[from].config.allowClickNav = true;
      if (this.currentGui.messages && this.currentGui.messages.length > 0) {
        // server-side error, go back to previous
        serverSideErrors = this.currentGui.messages.filter(msg => msg.severity === 'ERROR');
        if (!isNullOrUndefined(serverSideErrors)) {
          to = from; // roll back to "from" step
          this.wizard.goToPreviousStep();
        }
      }
    }
    this.history.resetTo(to + 1); // history is 1-based array
    this.history.done();
    if (!isNullOrUndefined(serverSideErrors)) {
      this.currentGui.messages = serverSideErrors;
    }
    this.form = this.buildForm(this.currentGui, wizardSteps[to]); // wizard.steps is 0-based array
    // post processing catch server-side errors
    wizardSteps[to].config.nextEnabled = this.form.valid
      && isNullOrUndefined(this.currentGui.messages);
    this.subscribeFormHistoryUpdate(to, wizardSteps);
  }

  loadUi(): Promise<Gui> {
    this.isLoading = true;
    return this.forgeService.loadGui(this.endNextPoint, this.history).then((gui: Gui) => {
      let from = this.history.stepIndex;
      this.history.add(gui);
      let to = this.history.stepIndex;
      if (to > 0) {
        to = to - 1;
      }
      if (from > 0) {
        from = from - 1;
      }
      this.move(from, to, flattenWizardSteps(this.wizard));
      this.isLoading = false;
      return gui;
    });
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

  private subscribeFormHistoryUpdate(index: number, wizardSteps = this.wizard.steps) {
    this.form.valueChanges.subscribe(values => {
      wizardSteps[index].config.nextEnabled = this.form.valid;
      if (!isNullOrUndefined(this.currentGui.messages)) {
        this.currentGui.messages = null;
      }
      this.history.updateFormValues(values);
    });
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
