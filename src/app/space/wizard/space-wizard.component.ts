import {
  Component,
  ErrorHandler,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Router } from '@angular/router';

import { Logger, Notification, Notifications, NotificationType } from 'ngx-base';
import { Context, SpaceNamePipe, SpaceService } from 'ngx-fabric8-wit';
import { ProcessTemplate } from 'ngx-fabric8-wit';
import { Space, SpaceAttributes } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';
import { Observable } from 'rxjs';

import { ContextService } from 'app/shared/context.service';
import { DummyService } from 'app/shared/dummy.service';
import { SpaceNamespaceService } from 'app/shared/runtime-console/space-namespace.service';
import { SpacesService } from 'app/shared/spaces.service';

@Component({
  selector: 'space-wizard',
  templateUrl: './space-wizard.component.html',
  styleUrls: ['./space-wizard.component.less']
})
export class SpaceWizardComponent implements OnInit, OnDestroy {

  @Output('onSelect') onSelect = new EventEmitter();
  @Output('onCancel') onCancel = new EventEmitter();

  spaceTemplates: ProcessTemplate[];
  selectedTemplate: ProcessTemplate;
  space: Space;
  currentSpace: Space;

  constructor(
    private router: Router,
    public dummy: DummyService,
    private spaceService: SpaceService,
    private notifications: Notifications,
    private userService: UserService,
    private spaceNamespaceService: SpaceNamespaceService,
    private spaceNamePipe: SpaceNamePipe,
    private spacesService: SpacesService,
    private context: ContextService,
    private logger: Logger,
    private errorHandler: ErrorHandler
  ) {
    this.spaceTemplates = dummy.processTemplates;
    this.space = this.createTransientSpace();

  }

  ngOnDestroy() {
    this.finish();
  }

  /*
   * Creates a persistent collaboration space
   * by invoking the spaceService
   */
  createSpace() {
    if (!this.userService.currentLoggedInUser && !this.userService.currentLoggedInUser.id) {
      const err: Error = Error('Error creating space, invalid user.' + this.userService.currentLoggedInUser);
      this.errorHandler.handleError(err);
      this.logger.error(err);
      this.notifications.message(<Notification> {
        message: `Failed to create "${this.space.name}". Invalid user: "${this.userService.currentLoggedInUser}"`,
        type: NotificationType.DANGER
      });
      return;
    }

    console.log('Creating space', this.space, this.userService.currentLoggedInUser.id);
    if (!this.space) {
      this.space = this.createTransientSpace();
    }
    this.space.attributes.name = this.space.name.replace(/ /g, '_');

    this.space.relationships['owned-by'].data.id = this.userService.currentLoggedInUser.id;
    this.spaceService.create(this.space)
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
        this.router.navigate([createdSpace.relationalData.creator.attributes.username,
          createdSpace.attributes.name]);
        this.finish();
      },
      err => {
        this.errorHandler.handleError(err);
        this.logger.error(err);
        this.notifications.message(<Notification> {
          message: `Failed to create "${this.space.name}"`,
          type: NotificationType.DANGER
        });
        this.finish();
      });
  }

  ngOnInit() {
    const srumTemplates = this.spaceTemplates.filter(template => template.name === 'Scenario Driven Planning');
    if (srumTemplates && srumTemplates.length > 0) {
      this.selectedTemplate = srumTemplates[0];
    }
    this.context.current.subscribe((ctx: Context) => {
      if (ctx.space) {
        this.currentSpace = ctx.space;
        console.log(`ForgeWizardComponent::The current space has been updated to ${this.currentSpace.attributes.name}`);
      }
    });
  }

  finish() {
    console.log(`finish ...`);
    this.onSelect.emit({flow: 'selectFlow', space: this.space.attributes.name});
  }

  cancel() {
    this.onCancel.emit({});
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
      workitemtypegroups: {
        links: {
          related: ''
        }
      },
      'owned-by': {
        data: {
          id: '',
          type: 'identities'
        }
      }
    };
    return space;
  }
}
