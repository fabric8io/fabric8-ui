import { IModalHost } from '../../models/modal-host';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Notification, NotificationAction, Notifications, NotificationType } from 'ngx-base';
import {
  SpaceService,
  SpaceNamePipe
} from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { ProcessTemplate } from 'ngx-fabric8-wit';
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import { IWorkflow } from '../../models/workflow';
import { DummyService } from "app/shared/dummy.service";
import { SpaceNamespaceService } from "app/shared/runtime-console/space-namespace.service";
import { SpacesService } from "app/shared/spaces.service";
import { AppGeneratorConfiguratorService } from "app/space/wizard/services/app-generator.service";
import {
  Space,
  SpaceAttributes
} from 'ngx-fabric8-wit';

@Component({
  selector: 'space-creator',
  templateUrl: './space-creator.component.html',
  styleUrls: ['./space-creator.component.less']
})
export class SpaceCreatorComponent implements OnInit, OnDestroy {

  static instanceCount: number = 1;

  @Input() host: IModalHost;

  spaceTemplates: ProcessTemplate[];
  selectedTemplate: ProcessTemplate;
  space: Space;

  constructor(
    private router: Router,
    public dummy: DummyService,
    private spaceService: SpaceService,
    private notifications: Notifications,
    private userService: UserService,
    private spaceNamespaceService: SpaceNamespaceService,
    private spaceNamePipe: SpaceNamePipe,
    private spacesService: SpacesService
  ) {
    this.spaceTemplates = dummy.processTemplates;
    this.space = this.createTransientSpace();
  }

ngOnDestroy() {
  this.finish()
}

  /*
   * Creates a persistent collaboration space
   * by invoking the spaceService
   */
  createSpace() {
    console.log('Creating space', this.space);
    if (!this.space) {
      this.space = this.createTransientSpace();
    }
    this.space.attributes.name = this.space.name.replace(/ /g, '_');
    this.userService.getUser()
      .switchMap(user => {
        this.space.relationships['owned-by'].data.id = user.id;
        return this.spaceService.create(this.space);
      })
      .do(createdSpace => {
        this.spacesService.addRecent.next(createdSpace);
      })
      .switchMap(createdSpace => {
        return this.spaceNamespaceService
          .updateConfigMap(Observable.of(createdSpace))
          .map(() => createdSpace)
          // Ignore any errors coming out here, we've logged and notified them earlier
          .catch(err => Observable.of(createdSpace));
      })
      .subscribe(createdSpace => {
        //this.configurator.currentSpace = createdSpace;
        const primaryAction: NotificationAction = {
          name: `Open Space`,
          title: `Open ${this.spaceNamePipe.transform(createdSpace.attributes.name)}`,
          id: 'openSpace'
        };
        this.notifications.message(<Notification>{
          message: `Your new space is created!`,
          type: NotificationType.SUCCESS,
          primaryAction: primaryAction
        })
        .filter(action => action.id === primaryAction.id)
        .subscribe(action => {
          this.router.navigate([createdSpace.relationalData.creator.attributes.username,
          createdSpace.attributes.name]);
          this.finish();
        });
        this.finish();
      },
      err => {
        console.log('Error creating space', err);
        this.notifications.message(<Notification>{
          message: `Failed to create "${this.space.name}"`,
          type: NotificationType.DANGER
        });
        this.finish();
      });
  }

  ngOnInit() {
    this.host.closeOnEscape = true;
    this.host.closeOnOutsideClick = false;
    const srumTemplates = this.spaceTemplates.filter(template => template.name == "Scenario Driven Planning")
    if (srumTemplates && srumTemplates.length > 0) {
      this.selectedTemplate = srumTemplates[0];
    }
  }

  finish() {
    this.space = this.createTransientSpace();

    if (this.host) {
      this.host.close();
    }
  }

  private createTransientSpace(): Space {
    let space = {} as Space;
    space.name = '';
    space.path = '';
    space.attributes = new SpaceAttributes();
    space.attributes.name = space.name;
    space.type = 'spaces';
    space.privateSpace = false;
    space.process = { name: '', description: '' };
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
    return space;
  }
}
