import { Component, ViewEncapsulation } from '@angular/core';

import { Broadcaster, Notifications } from 'ngx-base';
import { ForgeService } from 'ngx-forge';
import { Gui, Input } from 'ngx-forge';
import { Observable } from 'rxjs/Rx';

import { AbstractWizard, flattenWizardSteps } from 'app/space/forge-wizard/abstract-wizard.component';
import { ContextService } from '../../shared/context.service';
import { Codebase } from '../create/codebases/services/codebase';
import { CodebasesService } from '../create/codebases/services/codebases.service';
import { configureSteps } from './import-wizard.config';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'import-wizard',
  templateUrl: './import-wizard.component.html',
  styleUrls: ['./import-wizard.component.less']
})
export class ForgeImportWizardComponent extends AbstractWizard {

  constructor(forgeService: ForgeService,
              codebasesService: CodebasesService,
              context: ContextService,
              notifications: Notifications,
              broadcaster: Broadcaster) {
    super(forgeService, broadcaster, codebasesService, context, notifications);
    this.endPoint = 'fabric8-import-git';
    this.steps = configureSteps();
    this.isLoading = true;
    this.EXECUTE_STEP_INDEX = this.steps[6].priority - 1;
    this.LAST_STEP = this.steps[7].priority - 1;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadUi().then(gui => {
      const skipGitRepository = gui.metadata.name
        === 'io.fabric8.forge.generator.github.GitHubImportPickRepositoriesStep';
      this.steps[3].disabled =  skipGitRepository;
      if (skipGitRepository) {
        // remove one step
        this.wizard.goToNextStep();
        this.move(0, 0, flattenWizardSteps(this.wizard));
        this.EXECUTE_STEP_INDEX--;
        this.LAST_STEP--;
      }
      this.isLoading = false;
    }).catch(error => {
      this.isLoading = false;
      this.error = error;
    });
  }

  executeStep(wizardSteps = this.wizard.steps): void {
    this.isLoading = true;
    this.wizard.config.nextTitle = 'Ok';
    wizardSteps[this.LAST_STEP].config.nextEnabled = false;
    wizardSteps[this.LAST_STEP].config.previousEnabled = false;
    wizardSteps.map(step => step.config.allowClickNav = false);
    // special case of last step, you can't navigate using step navigation
    this.wizard.steps.map(step => step.config.allowClickNav = false);
    this.forgeService.executeStep('fabric8-import-git', this.history).then((gui: Gui) => {
      this.result = gui[6] as Input;
      this.augmentStep(gui);
      this.isLoading = false;
      wizardSteps[this.LAST_STEP].config.nextEnabled = true;
    }).catch(error => {
      this.isLoading = false;
      this.error = error;
    });
  }

  addCodebaseDelegate(spaceId: string, code: Codebase): Observable<Codebase> {
    return this.codebasesService.addCodebase(spaceId, code);
  }

}

