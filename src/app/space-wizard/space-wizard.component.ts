import { Context } from './../models/context';
import { WizardSteps } from './../shared-component/wizard/wizard-steps';
import { Wizard } from './../shared-component/wizard/wizard';
import { ContextService } from './../shared/context.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { SpaceService, Space, ProcessTemplate, SpaceAttributes } from 'ngx-fabric8-wit';
import { Broadcaster, User } from 'ngx-login-client';

import { DummyService } from '../shared/dummy.service';
import { SpaceConfigurator } from './wizard';
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
  wizard: Wizard;
  wizardSteps: WizardSteps;
  @Input() host: Modal;

  private _context: Context;

  constructor(
    private router: Router,
    public dummy: DummyService,
    private broadcaster: Broadcaster,
    private spaceService: SpaceService,
    context: ContextService) {
      context.current.subscribe(val => this._context = val);
  }

  ngOnInit() {
    this.reset();
    this.wizardSteps = {
      space: { index: 0 },
      forge: { index: 1 },
      quickStart: { index: 2 },
      stack: { index: 3 },
      pipeline: { index: 4 }
    } as WizardSteps;
    this.host.closeOnEscape = true;
    this.host.closeOnOutsideClick = false;
  }

  next() {
  }

  reset() {
    let configurator = new SpaceConfigurator();
    let space = {} as Space;
    // TODO Move this to SpaceService
    space.name = '';
    space.path = '';
    space.attributes = new SpaceAttributes();
    space.attributes.name = space.name;
    space.type = 'spaces';
    space.privateSpace = false;
    space.process = this.dummy.processTemplates[0];
    configurator.space = space;
    this.configurator = configurator;
    this.wizard = new Wizard();
  }

  finish() {
    console.log('finish!', this._context);
    let space = this.configurator.space;
    space.attributes.name = space.name;
    console.log(this._context);
    if (this._context && this._context.entity) {
      // TODO Implement space name validation
      // Support organisations as well
      space.path =
        (this._context.entity as User).attributes.username + '/' + this.convertNameToPath(space.name);
    } else if (this._context) {
      space.path = this.dummy.currentUser + '/' + this.convertNameToPath(space.name);
    }

    this.spaceService.create(space).then((createdSpace => {
      this.dummy.spaces.push(space);
      this.broadcaster.broadcast('save', 1);
      if (space.path) {
        this.router.navigate([space.path]);
      }
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
      this.reset();
    }
  }

  private convertNameToPath(name: string) {
    // convert to ASCII etc.
    return name.replace(' ', '-').toLowerCase();
  }

}
