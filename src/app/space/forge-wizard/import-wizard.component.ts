import { Component } from '@angular/core';
import { WizardEvent } from 'patternfly-ng';
import { ForgeService } from 'app/space/forge-wizard/forge.service';
import { Gui, Input, MetaData } from 'app/space/forge-wizard/gui.model';
import { CodebasesService } from '../create/codebases/services/codebases.service';
import { Codebase } from '../create/codebases/services/codebase';
import { ContextService } from '../../shared/context.service';
import { Observable } from 'rxjs/Rx';
import { NotificationType, Notification, Notifications } from 'ngx-base';
import { AbstractWizard, flattenWizardSteps } from 'app/space/forge-wizard/abstract-wizard.component';
import { configureSteps } from './import-wizard.config';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'import-wizard',
  templateUrl: './import-wizard.component.html',
  styleUrls: ['./import-wizard.component.less']
})
export class ForgeImportWizardComponent extends AbstractWizard {

  private result: Input;

  constructor(forgeService: ForgeService,
              private codebasesService: CodebasesService,
              context: ContextService,
              private notifications: Notifications) {
    super(forgeService, context);
    this.endNextPoint = 'fabric8-import-git';
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

  executeStep(wizardSteps = this.wizard.steps): void {
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

  addCodebaseDelegate(spaceId: string, code: Codebase): Observable<Codebase> {
    return this.codebasesService.addCodebase(spaceId, code);
  }

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

