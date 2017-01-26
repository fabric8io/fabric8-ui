import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DummyService } from '../dummy/dummy.service';
import { SpaceConfigurator, IWizardSteps, Wizard, WizardNavigator, ProjectType, ProjectInfo, StackInfo, PipelineInfo, PipelineStageInfo, PipelineTaskInfo, PipelineEnvironmentInfo } from '../models/wizard';
import { Space } from '../models/space';
import { ProcessTemplate } from '../models/process-template';
import { Broadcaster } from '../shared/broadcaster.service';

@Component({
  host: {
    'class': 'wizard-container'
  },
  selector: 'space-wizard',
  templateUrl: './space-wizard.component.html',
  styleUrls: ['./space-wizard.component.scss']
})
export class SpaceWizardComponent implements OnInit {
  configurator: SpaceConfigurator
  ngOnInit() {
    this.configurator = new SpaceConfigurator()
    this.configurator.initSpace((space: Space) => {
      space.process = this.dummy.processTemplates[0];
    });
    this.wizardSteps = {
      space: { index: 0 },
      forge: { index: 1 },
      quickStart: { index: 2 },
      stack: { index: 3 },
      pipeline: { index: 4 },
    };
  }

  wizard: Wizard = new Wizard();
  wizardSteps: IWizardSteps;

  finish() {
    let configuredSpace = this.configurator.space;
    // this.dummy.spaces.push(configuredSpace);
    // this.broadcaster.broadcast('save', 1);
    this.router.navigate([configuredSpace.path]);
  }
  cancel() {
    this.router.navigate(["/home"]);
  }

  constructor(
    private router: Router,
    public dummy: DummyService,
    private broadcaster: Broadcaster) {
  }
}
