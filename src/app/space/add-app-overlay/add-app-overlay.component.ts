import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Broadcaster } from 'ngx-base';
import { Context, Space } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';

import { ContextService } from 'app/shared/context.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-add-app-overlay',
  styleUrls: ['./add-app-overlay.component.less'],
  templateUrl: './add-app-overlay.component.html'
})
export class AddAppOverlayComponent implements OnDestroy, OnInit {
  currentSpace: Space;
  loggedInUser: User;
  spaces: Space[] = [];
  subscriptions: Subscription[] = [];

  constructor(private context: ContextService,
              private broadcaster: Broadcaster,
              private userService: UserService,
              private router: Router) {
    this.subscriptions.push(userService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
    }));
    this.subscriptions.push(context.current.subscribe((ctx: Context) => {
      this.currentSpace = ctx.space;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit() {
  }

  /**
   * Helpfer to route to create app
   */
  handleCancel($event: any): void {
    this.router.navigate(['/', this.loggedInUser.attributes.username, this.currentSpace.attributes.name]);
  }

  hideAddAppOverlay(): void {
    this.broadcaster.broadcast('showAddAppOverlay', false);
  }

  /**
   * Helpfer to route to create app
   */
  routeToCreateApp(): void {
    this.router.navigate(['/',
      this.loggedInUser.attributes.username, this.currentSpace.attributes.name,
      'applauncher', 'createapp']);
    this.hideAddAppOverlay();
  }

  /**
   * Helpfer to route to create app
   */
  routeToImportApp(): void {
    this.router.navigate(['/',
      this.loggedInUser.attributes.username, this.currentSpace.attributes.name,
      'applauncher', 'importapp']);
    this.hideAddAppOverlay();
  }
}
