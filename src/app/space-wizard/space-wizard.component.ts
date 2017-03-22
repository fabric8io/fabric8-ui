import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { Observable } from 'rxjs';

import { Broadcaster, Notification, NotificationType, NotificationAction, Notifications } from 'ngx-base';
import {
  SpaceService,
  Space,
  ProcessTemplate,
  SpaceAttributes,
  Context,
  Contexts
} from 'ngx-fabric8-wit';
import { User, HttpService, UserService } from 'ngx-login-client';

import { DummyService } from '../shared/dummy.service';
import { SpaceConfigurator } from './wizard';
import { Modal } from '../shared-component/modal/modal';
import { WizardSteps } from './../shared-component/wizard/wizard-steps';
import { Wizard } from './../shared-component/wizard/wizard';

@Component({
  host: {
    'class': 'wizard-container'
  },
  selector: 'space-wizard',
  templateUrl: './space-wizard.component.html',
  styleUrls: ['./space-wizard.component.scss']
})
export class SpaceWizardComponent implements OnInit {

  configurator: SpaceConfigurator;
  wizard: Wizard;
  wizardSteps: WizardSteps;
  @Input() host: Modal;

  private _context: Context;

  constructor(
    public router: Router,
    public dummy: DummyService,
    private broadcaster: Broadcaster,
    private spaceService: SpaceService,
    private notifications: Notifications,
    private userService: UserService,
    context: Contexts,
  ) {
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

  createSpace() {
    let space = this.configurator.space;
    console.log('Creating space', space);
    space.attributes.name = space.name;
    this.userService.getUser().switchMap(user => {
      space.relationships['owned-by'].data.id = user.id;
      return this.spaceService.create(space);
    })
      .subscribe(createdSpace => {
        this.configurator.space = createdSpace;
        let actionObservable = this.notifications.message({
          message: `Your new space is created!`,
          type: NotificationType.SUCCESS,
          primaryAction: {
            name: `Open Space`,
            title: `Open ${createdSpace.attributes.name}`,
            id: 'openSpace'
          } as NotificationAction
        } as Notification);
        actionObservable
          .filter(action => action.id === 'openSpace')
          .subscribe(action => {
            this.router
              .navigate([createdSpace.relationalData.creator.attributes.username, createdSpace.attributes.name]);
            if (this.host) {
              this.host.close();
              this.reset();
            }
          });
        this.wizard.step(this.wizardSteps.forge.index);
      },
      err => {
        this.notifications.message({
          message: `Failed to create "${space.name}"`,
          type: NotificationType.DANGER

        } as Notification);
        if (this.host) {
          this.host.close();
          this.reset();
        }
      });
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
    space.relationships = {
      areas: {
        links: {
          related: ''
        }
      },
      iterations: {
        links: {
          related: ''
        }
      },
      ['owned-by']: {
        data: {
          id: '',
          type: 'identities'
        }
      }
    };
    configurator.space = space;
    this.configurator = configurator;
    this.wizard = new Wizard();
  }

  finish() {
    this.router.navigate([
      this.configurator.space.relationalData.creator.attributes.username,
      this.configurator.space.attributes.name
    ]);
    if (this.host) {
      this.host.close();
      this.reset();
    }
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
