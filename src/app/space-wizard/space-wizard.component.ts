import { WizardSteps } from './../shared-component/wizard/wizard-steps';
import { Wizard } from './../shared-component/wizard/wizard';
import { ContextService } from './../shared/context.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster, User } from 'ngx-login-client';

import { DummyService } from '../shared/dummy.service';
import { SpaceConfigurator } from './wizard';
import { Space, SpaceAttributes } from '../models/space';
import { ProcessTemplate } from '../models/process-template';
import { SpaceService } from '../profile/spaces/space.service';
import { Modal } from '../shared-component/modal/modal';

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
  wizardSteps: WizardSteps;
  @Input() host: Modal;

  constructor(
    private router: Router,
    public dummy: DummyService,
    private broadcaster: Broadcaster,
    private spaceService: SpaceService,
    private context: ContextService) {
  }

  ngOnInit() {
    this.reset();
    this.wizardSteps = {
      space: { index: 0 },
      forge: { index: 1 },
      quickStart: { index: 2 },
      stack: { index: 3 },
      pipeline: { index: 4 }
    };
    this.host.closeOnEscape = true;
    this.host.closeOnOutsideClick = false;
  }

  next() {
    console.log('here');
  }

  reset() {
    let configurator = new SpaceConfigurator();
    let space = {} as Space;
    space.name = '';
    space.path = '';
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
    if (this.context.current.entity) {
      // TODO Implement space name validation
      // Support organisations as well
      space.path =
        (this.context.current.entity as User).attributes.username + '/' + this.convertNameToPath(space.name);
    }

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

  private convertNameToPath(name: string) {
    // convert to ASCII etc.
    return name.replace(' ', '-').toLowerCase();
  }

}
