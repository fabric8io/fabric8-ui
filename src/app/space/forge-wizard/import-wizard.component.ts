import { Component } from '@angular/core';
import { WizardEvent } from 'patternfly-ng';
import { ForgeService } from 'app/space/forge-wizard/forge.service';
import { Gui, Input, MetaData } from 'app/space/forge-wizard/gui.model';
import { CodebasesService } from '../create/codebases/services/codebases.service';
import { Codebase } from '../create/codebases/services/codebase';
import { ContextService } from '../../shared/context.service';
import { Observable } from 'rxjs/Rx';
import { NotificationType, Notification, Notifications } from 'ngx-base';
import { isNullOrUndefined } from 'util';
import { AbstractWizard, flattenWizardSteps } from 'app/space/forge-wizard/abstract-wizard.component';
import { configureSteps } from './import-wizard.config';


@Component({
  selector: 'import-wizard',
  templateUrl: './import-wizard.component.html',
  styleUrls: ['./import-wizard.component.less']
})
export class ForgeImportWizardComponent extends AbstractWizard {

  private result: Input;

  constructor(private forgeService: ForgeService,
              private codebasesService: CodebasesService,
              context: ContextService,
              private notifications: Notifications) {
    super(context);
    this.steps = configureSteps();
    this.isLoading = true;
    this.EXECUTE_STEP_INDEX = this.steps[6].priority - 1;
    this.LAST_STEP = this.steps[7].priority - 1;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadUi().then(gui => {
      this.steps[3].disabled = gui.metadata.name
        === 'io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep';
      this.steps[3].nextEnabled = true;
      this.wizard.goToStep(0, true);
      this.isLoading = false;
    });
  }

  nextClicked($event: WizardEvent): void {
    // if (this.form.valid) {
      if (this.history.stepIndex === this.EXECUTE_STEP_INDEX + 1) { // execute
        this.executeStep(flattenWizardSteps(this.wizard));
      } else if (this.history.stepIndex === this.LAST_STEP + 1) { // addcodebaseStep
        this.addCodebaseStep();
      } else { // init or next
        this.loadUi();
      }
    // }
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

  private loadUi(): Promise<Gui> {
    this.isLoading = true;
    return this.forgeService.loadGui('fabric8-import-git', this.history).then((gui: Gui) => {
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

  private subscribeFormHistoryUpdate(index: number, wizardSteps = this.wizard.steps) {
    this.form.valueChanges.subscribe(values => {
      wizardSteps[index].config.nextEnabled = this.form.valid;
      if (!isNullOrUndefined(this.currentGui.messages)) {
        this.currentGui.messages = null;
      }
      this.history.updateFormValues(values);
    });
  }

  private executeStep(wizardSteps = this.wizard.steps): void {
    this.isLoading = true;
    this.wizard.config.nextTitle = 'Ok';
    wizardSteps[this.LAST_STEP].config.nextEnabled = false;
    wizardSteps[this.LAST_STEP].config.previousEnabled = false;
    wizardSteps.map(step => step.config.allowClickNav = false);
    this.forgeService.executeStep('fabric8-import-git', this.history).then((gui: Gui) => {
      this.result = gui[6] as Input;
      let newGui = this.augmentStep(gui);
      this.isLoading = false;
      wizardSteps[this.LAST_STEP].config.nextEnabled = true;
      console.log('Response from execute' + JSON.stringify(gui));
    });
  }

  private addCodebaseDelegate(spaceId: string, code: Codebase): Observable<Codebase> {
    return this.codebasesService.addCodebase(spaceId, code);
  }

  private addCodebaseStep(): void {
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
        console.log(`Successfully added codebase ${codebase.attributes.url}`);
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
          console.log(`completed`);
          this.isLoading = false;
          // TODO Display error
          this.onCancel.emit({});
        });
  }

  private augmentStep(gui: Gui) {
    let newGui = this.convertResultToGui(this.result);
    this.history.add(newGui);
    return newGui;
  }

  private convertResultToGui(result: Input): Gui {
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

  private convertResultToCodebases(result: Input): Codebase[] {
    let codebases: Codebase[] = [];
    if (this.result.gitRepositories) {
      this.result.gitRepositories.forEach(repo => {
        let codebase = {
          attributes: {
            type: 'git',
            url: repo.url,
            stackId: repo.stackId
          },
          type: 'codebases'
        } as Codebase;
        codebases.push(codebase);
      });
    }
    return codebases;
  }
}

