import {
  Component, ErrorHandler,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { ContextService } from 'app/shared/context.service';
import { DummyService } from 'app/shared/dummy.service';
import { SpaceNamespaceService } from 'app/shared/runtime-console/space-namespace.service';
import { Broadcaster, Notification, Notifications, NotificationType } from 'ngx-base';
import { Context, SpaceNamePipe, SpaceService } from 'ngx-fabric8-wit';
import { Space } from 'ngx-fabric8-wit';
import { ProcessTemplate } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs/Rx';
import * as SpaceActions from '../../shared/actions/space.actions';
import { SpaceEffects } from '../../shared/effects/space.effects';
import { AppState } from '../../shared/states/app.state';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-add-space-overlay',
  styleUrls: ['./add-space-overlay.component.less'],
  templateUrl: './add-space-overlay.component.html'
})
export class AddSpaceOverlayComponent implements OnInit {
  currentSpace: Space;
  selectedTemplate: ProcessTemplate;
  spaceTemplates: ProcessTemplate[];
  space: Space;
  private error: any;
  private spaceSource;
  subscriptions: Subscription[] = [];
  constructor(private router: Router,
              public dummy: DummyService,
              private spaceService: SpaceService,
              private notifications: Notifications,
              private userService: UserService,
              private spaceNamespaceService: SpaceNamespaceService,
              private spaceNamePipe: SpaceNamePipe,
              private store: Store<AppState>,
              private errorHandler: ErrorHandler,
              private context: ContextService,
              private broadcaster: Broadcaster) {
    this.spaceTemplates = dummy.processTemplates;
    this.space = SpaceEffects.createTransientSpace('', '');
    this.spaceSource = this.store
      .select('fabric8-ui')
      .select('space');
    // .do(s => {if (!s) { this.store.dispatch(new SpaceActions.Get()); }});
    this.subscriptions.push(this.spaceSource
      .map(content => {
        console.log('Content' + content);
        if (!content) {
          // do nothing
        } else if (content.errorMessage) {
          this.error = {message: content.errorMessage};
        } else if (content.attributes) {
          this.router.navigate([content.relationalData.creator.attributes.username,
            content.attributes.name]); // this navigation will trigger this.spaceService.addRecent
          this.showAddAppOverlay();
          this.hideAddSpaceOverlay();
        }
      })
      .subscribe(createdSpace => {}));
  }

  ngOnInit() {
    const srumTemplates = this.spaceTemplates.filter(template => template.name === 'Scenario Driven Planning');
    if (srumTemplates && srumTemplates.length > 0) {
      this.selectedTemplate = srumTemplates[0];
    }
    this.context.current.subscribe((ctx: Context) => {
      if (ctx.space) {
        this.currentSpace = ctx.space;
      }
    });
  }
  resetError() {
    this.error = null;
  }
  /*
   * Creates a persistent collaboration space
   * by invoking the spaceService
   */
  createSpace() {
    if (!this.userService.currentLoggedInUser && !this.userService.currentLoggedInUser.id) {
      const err: Error = Error('Error creating space, invalid user.' + this.userService.currentLoggedInUser);
      this.errorHandler.handleError(err);
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

  hideAddSpaceOverlay(): void {
    this.broadcaster.broadcast('showAddSpaceOverlay', false);
  }

  showAddAppOverlay(): void {
    this.broadcaster.broadcast('showAddAppOverlay', true);
  }
}
