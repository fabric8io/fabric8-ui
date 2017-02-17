import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-login-client';

import { DummyService } from '../shared/dummy.service';
import { SpaceConfigurator, IWizardSteps, Wizard } from './wizard';
import { Space, SpaceAttributes } from '../models/space';
import { ProcessTemplate } from '../models/process-template';
import { SpaceService } from '../profile/spaces/space.service';

interface IModal {
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
  open();
  close();
  onOpen();
  onClose();
}

@Component({
  host: {
    'class': 'wizard-container'
  },
  selector: 'space-wizard',
  templateUrl: './space-wizard.component.html',
  styleUrls: ['./space-wizard.component.scss'],
  providers: [SpaceService]

})
export class SpaceWizardComponent implements OnInit {

  configurator: SpaceConfigurator;
  wizard: Wizard = new Wizard();
  wizardSteps: IWizardSteps;
  @Input() host: IModal;

  constructor(
    private router: Router,
    public dummy: DummyService,
    private broadcaster: Broadcaster,
    private spaceService: SpaceService) {
  }

  ngOnInit() {
    this.reset();
    this.wizardSteps = {
      space: { index: 0 },
      forge: { index: 1 },
      quickStart: { index: 2 },
      stack: { index: 3 },
      pipeline: { index: 4 },
    };
    this.host.closeOnEscape = true;
    this.host.closeOnOutsideClick = false;
  }

  reset() {
    let configurator = new SpaceConfigurator();
    let space = {} as Space;
    space.name = 'BalloonPopGame';
    // TODO: Once we have dynamic routing, fix this
    space.path = '/pmuir/BalloonPopGame';
    space.attributes = new SpaceAttributes();
    space.attributes.name = space.name;
    space.type = 'spaces';
    space.description = space.name;
    space.privateSpace = false;
    space.process = this.dummy.processTemplates[0];
    configurator.space = space;
    this.configurator = configurator;

  }

  finish() {

    let space = this.configurator.space;
    space.description = space.name;
    space.attributes.name = space.name;

    console.log(space);

    this.spaceService.create(space).then((createdSpace => {
      this.dummy.spaces.push(space);
      this.broadcaster.broadcast('save', 1);
      this.router.navigate([space.path]);
      this.reset();
    })).catch((err) => {
      // TODO:consistent error handling on failures
      let errMessage = `Failed to create the collaboration space:
        space name :
        ${space.name}
        message:
        ${err.message}
        `;
      alert(errMessage);
    });
  }

  cancel() {
    if (this.host) {
      this.host.close();
    }
  }

}
