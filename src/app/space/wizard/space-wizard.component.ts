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
import { Context, SpaceNamePipe } from 'ngx-fabric8-wit';
import { ProcessTemplate } from 'ngx-fabric8-wit';
import { Space } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';

import { ContextService } from 'app/shared/context.service';
import { DummyService } from 'app/shared/dummy.service';
import { SpaceNamespaceService } from 'app/shared/runtime-console/space-namespace.service';
import { SpacesService } from 'app/shared/spaces.service';

import { Store } from '@ngrx/store';
import { FeatureTogglesService } from '../../feature-flag/service/feature-toggles.service';
import { SpaceEffects } from '../../shared/effects/space.effects';
import { AppState } from '../../shared/states/app.state';
import * as SpaceActions from './../../shared/actions/space.actions';

@Component({
  selector: 'space-wizard',
  templateUrl: './space-wizard.component.html',
  styleUrls: ['./space-wizard.component.less']
})
export class SpaceWizardComponent implements OnInit, OnDestroy {
  private spaceSource;

  @Output('onSelect') onSelect = new EventEmitter();
  @Output('onCancel') onCancel = new EventEmitter();

  appLauncherEnabled: boolean = false;
  spaceTemplates: ProcessTemplate[];
  selectedTemplate: ProcessTemplate;
  space: Space;
  subscriptions: Subscription[] = [];
  currentSpace: Space;
  private error: any;

  constructor(
    private store: Store<AppState>,
    private broadcaster: Broadcaster,
    private featureTogglesService: FeatureTogglesService,
    private router: Router,
    public dummy: DummyService,
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
    this.space = SpaceEffects.createTransientSpace('', '');
    this.subscriptions.push(featureTogglesService.getFeature('AppLauncher').subscribe((feature) => {
      this.appLauncherEnabled = feature.attributes['enabled'] && feature.attributes['user-enabled'];
    }));
    this.spaceSource = this.store
      .select('fabric8-ui')
      .select('space');
     // .do(s => {if (!s) { this.store.dispatch(new SpaceActions.Get()); }});
    this.subscriptions.push(this.spaceSource
      .map(content => {
        console.log('Content' + content);
        if (!content) {
          this.cancel();
        } else if (content.errorMessage) {
          this.error = {message: content.errorMessage};
        } else if (content.attributes) {
          this.router.navigate([content.relationalData.creator.attributes.username,
            content.attributes.name]); // this navigation will trigger this.spaceService.addRecent
          this.finish();
        }
      })
      .subscribe(createdSpace => {}));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
    this.finish();
  }

  resetError() {
    this.error = null;
  }
  /*
   * Creates a persistent collaboration space
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
    this.space.attributes.name = this.space.name.replace(/ /g, '_');
    this.space.relationships['owned-by'].data.id = this.userService.currentLoggedInUser.id;

    this.store.dispatch(new SpaceActions.Add({
      spaceName: this.space.name,
      ownerId: this.userService.currentLoggedInUser.id
    }));
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

  showAddSpaceOverlay(): void {
    this.broadcaster.broadcast('showAddSpaceOverlay', true);
    this.cancel();
  }
}
