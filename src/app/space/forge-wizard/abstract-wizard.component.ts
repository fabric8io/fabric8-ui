import { EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  WizardComponent,
  WizardConfig,
  WizardEvent,
  WizardStep,
  WizardStepComponent,
  WizardStepConfig
} from 'patternfly-ng';
import { ContextService } from '../../shared/context.service';
import { Context, Space } from 'ngx-fabric8-wit';
import { isNullOrUndefined } from 'util';
import {
  ForgeService,
  History,
  Gui,
  Input,
  MetaData
} from 'ngx-forge';
import { Codebase } from '../create/codebases/services/codebase';
import { Observable } from 'rxjs';
import { CodebasesService } from '../create/codebases/services/codebases.service';
import { NotificationType, Notification, Notifications } from 'ngx-base';

export abstract class AbstractWizard implements OnInit {
  @ViewChild('wizard') wizard: WizardComponent;

  result: Input;
  error: any;
  form: FormGroup = new FormGroup({});
  history: History = new History();
  config: WizardConfig;
  steps: WizardStepConfig[];
  currentSpace: Space;
  isLoading = true;
  endPoint: string;
  EXECUTE_STEP_INDEX: number;
  LAST_STEP: number;
  @Output('onCancel') onCancel = new EventEmitter();

  constructor(public forgeService: ForgeService,
              public codebasesService: CodebasesService,
              public context: ContextService,
              public notifications: Notifications) {
    this.steps = [];
    this.config = {
      title: 'Application Wizard',
      sidebarStyleClass: 'wizard-sidebar',
      stepStyleClass: 'wizard-step'
    } as WizardConfig;
    this.context.current.subscribe((ctx: Context) => {
      if (ctx.space) {
        this.currentSpace = ctx.space;
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

  reviewStep(): void {
    this.isLoading = true;
    let space = this.currentSpace;
    let codebases: Codebase[] = this.convertResultToCodebases(this.result);
    let obs: Observable<Codebase>;
    codebases.forEach(code => {
      if (!obs) {
        obs = this.addCodebaseDelegate(space.id, code);
      } else {
        obs = obs.concat(this.addCodebaseDelegate(space.id, code));
      }
    });
    obs.subscribe(
      codebase => {
        // todo broadcast
        // this._broadcaster.broadcast('codebaseAdded', codebase);
        this.notifications.message(<Notification>{
          message: `Your ${codebase.attributes.url} repository has been `
          + `added to the ${this.currentSpace.attributes.name} space`,
          type: NotificationType.SUCCESS
        });
      },
      err => console.log(`Error adding codebase ${err}`),
      () => {
        this.isLoading = false;
        // TODO Display error
        this.onCancel.emit({});
      });
  }

  nextClicked($event: WizardEvent): void {
    if (this.history.stepIndex === this.EXECUTE_STEP_INDEX + 1) { // execute
      this.executeStep(flattenWizardSteps(this.wizard));
    } else if (this.history.stepIndex === this.LAST_STEP + 1) { // addcodebaseStep
      this.reviewStep();
    } else { // init or next
      this.loadUi().catch(error => {
        this.isLoading = false;
        this.error = error;
      });
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
      this.wizard.config.nextTitle = 'Next >';
    }
    if (to === this.LAST_STEP) {
      return;
    }
    if (from > to ) {
      wizardSteps.filter(step => step.config.priority > to).map(step => {
        // moving backward, all steps after this one should not be navigable
        step.config.allowClickNav = false;
        let parentStep = getParentStep(this.wizard.steps, step);
        parentStep.config.allowClickNav = false;
        // next/previous button
        step.config.nextEnabled = false;
      });
    } else {
      // moving forward (only one step at a time with next)
      wizardSteps[from].config.allowClickNav = true;
      let parentStep = getParentStep(this.wizard.steps, wizardSteps[from]);
      parentStep.config.allowClickNav = true;
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
    return this.forgeService.loadGui(this.endPoint, this.history).then((gui: Gui) => {
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

  protected augmentStep(gui: Gui) {
    let newGui = this.convertResultToGui(this.result);
    this.history.add(newGui);
    return newGui;
  }

  protected convertResultToGui(result: Input): Gui {
    let newGui = new Gui();
    newGui.metadata = {name: 'Review'} as MetaData;
    newGui.inputs = [];
    if (this.result.gitRepositories) {
      this.result.gitRepositories.forEach(repo => {
        let input = {
          label: repo.url,
          name: repo.url,
          valueType: 'java.lang.String',
          enabled: false,
          required: false,
          display: {
            namespace: (this.result as any).namespace,
            buildConfigName: (this.result as any).buildConfigName,
            cheStackId: (this.result as any).cheStackId
            // TODO fix it che stack id should be returned per repo
            // https://github.com/fabric8io/fabric8-generator/issues/54
          }
        } as Input;
        newGui.inputs.push(input);
      });
    }
    return newGui;
  }

  protected convertResultToCodebases(result: Input): Codebase[] {
    let codebases: Codebase[] = [];
    if (this.result.gitRepositories) {
      this.result.gitRepositories.forEach(repo => {
        let cheStackId = repo.stackId ? repo.stackId : (this.result as any).cheStackId;
        let codebase = {
          attributes: {
            type: 'git',
            url: repo.url,
            stackId: cheStackId
          },
          type: 'codebases'
        } as Codebase;
        codebases.push(codebase);
      });
    }
    return codebases;
  }
  protected addCodebaseDelegate(spaceId: string, code: Codebase): Observable<Codebase> {
    return this.codebasesService.addCodebase(spaceId, code);
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
      step.steps.filter(s => !s.config.disabled)
        .forEach(substep => {
        flatWizard.push(substep);
      });
    } else {
      flatWizard.push(step);
    }
  });
  return flatWizard;
}

export function getParentStep(wizardSteps: WizardStep[], subStep: WizardStep): WizardStep {
  let found: WizardStep;
  wizardSteps.forEach((step: WizardStepComponent) => {
    if (step === subStep) {
      found = step;
    }
    if (step.hasSubsteps) {
      const elt = step.steps.find(sub => sub === subStep);
      if (elt) {
        found = step;
      }
    }
  });
  return found;
}
