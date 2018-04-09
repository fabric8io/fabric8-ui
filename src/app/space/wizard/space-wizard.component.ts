import {
  Component,
  ErrorHandler,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Broadcaster, Logger, Notification, Notifications, NotificationType } from 'ngx-base';
import { Context, ProcessTemplate, SpaceNamePipe, SpaceService } from 'ngx-fabric8-wit';
import { Space, SpaceAttributes } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';
import { Observable } from 'rxjs';

import { ContextService } from 'app/shared/context.service';
import { SpaceNamespaceService } from 'app/shared/runtime-console/space-namespace.service';
import { SpaceTemplateService } from 'app/shared/space-template.service';
import { SpacesService } from 'app/shared/spaces.service';

import { FeatureTogglesService } from '../../feature-flag/service/feature-toggles.service';

@Component({
  selector: 'space-wizard',
  templateUrl: './space-wizard.component.html',
  styleUrls: ['./space-wizard.component.less']
})
export class SpaceWizardComponent implements OnInit, OnDestroy {

  @Output('onSelect') onSelect = new EventEmitter();
  @Output('onCancel') onCancel = new EventEmitter();

  appLauncherEnabled: boolean = false;
  spaceTemplates: ProcessTemplate[];
  selectedTemplate: ProcessTemplate = null;
  space: Space;
  subscriptions: Subscription[] = [];
  currentSpace: Space;

  constructor(
    private broadcaster: Broadcaster,
    private featureTogglesService: FeatureTogglesService,
    private router: Router,
    private spaceService: SpaceService,
    private notifications: Notifications,
    private userService: UserService,
    private spaceNamespaceService: SpaceNamespaceService,
    private spaceNamePipe: SpaceNamePipe,
    private spacesService: SpacesService,
    private spaceTemplateService: SpaceTemplateService,
    private context: ContextService,
    private logger: Logger,
    private errorHandler: ErrorHandler
  ) {
    this.spaceTemplates = [];
    this.space = this.createTransientSpace();
    this.subscriptions.push(featureTogglesService.getFeature('AppLauncher').subscribe((feature) => {
      this.appLauncherEnabled = feature.attributes['enabled'] && feature.attributes['user-enabled'];
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
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
    if (this.selectedTemplate !== null &&
      this.selectedTemplate.id !== '0') {
      this.space.relationships['space-template'] = {
        data: {
          id: this.selectedTemplate.id,
          type: this.selectedTemplate.type
        }
      };
    }

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
    this.context.current.subscribe((ctx: Context) => {
      if (ctx.space) {
        this.currentSpace = ctx.space;
        console.log(`ForgeWizardComponent::The current space has been updated to ${this.currentSpace.attributes.name}`);
      }
    });
    this.spaceTemplateService.getSpaceTemplates()
      .subscribe((templates: ProcessTemplate[]) => {
        this.spaceTemplates = templates.filter(t => t.attributes['can-construct']);
        this.selectedTemplate = !!this.spaceTemplates.length ? this.spaceTemplates[0] : null;
      }, () => {
        this.spaceTemplates = [{
          id: '0',
          attributes: {
            name: 'Default template',
            description: 'This is a default space template'
          }
        } as ProcessTemplate];
        this.selectedTemplate = this.spaceTemplates[0];
      });
  }

  finish() {
    console.log(`finish ...`);
    this.onSelect.emit({flow: 'selectFlow', space: this.space.attributes.name});
  }

  cancel() {
    this.onCancel.emit({});
  }

  showAddSpaceOverlay(): void {
    this.broadcaster.broadcast('showAddSpaceOverlay', true);
    this.cancel();
  }

  private createTransientSpace(): Space {
    let space = {} as Space;
    space.name = '';
    space.path = '';
    space.attributes = new SpaceAttributes();
    space.attributes.name = space.name;
    space.type = 'spaces';
    space.privateSpace = false;
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
