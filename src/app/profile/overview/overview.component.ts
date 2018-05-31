import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster, Notification, Notifications, NotificationType } from 'ngx-base';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { Space, SpaceService } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';

import { ExtProfile } from '../../getting-started/services/getting-started.service';
import { ContextService } from '../../shared/context.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent implements OnDestroy, OnInit {
  context: Context;
  loggedInUser: User;
  subscriptions: Subscription[] = [];
  spaces: Space[] = [];
  viewingOwnAccount: boolean;
  selectedTab: number = 1;

  constructor(
      private contexts: Contexts,
      private spaceService: SpaceService,
      private userService: UserService,
      private notifications: Notifications,
      private contextService: ContextService,
      private broadcaster: Broadcaster,
      private router: Router) {
    this.subscriptions.push(contexts.current.subscribe(val => this.context = val));
    this.subscriptions.push(userService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
      if (user.attributes) {
        this.subscriptions.push(spaceService.getSpacesByUser(user.attributes.username, 10).subscribe(spaces => {
          this.spaces = spaces;
        }));
      }
    }));
    this.subscriptions.push(this.broadcaster.on('contextChanged').subscribe(val => {
      this.context = val as Context;
      this.viewingOwnAccount = this.contextService.viewingOwnContext();
    }));
  }

  ngOnInit() {
    this.viewingOwnAccount = this.contextService.viewingOwnContext();
    if (this.viewingOwnAccount && this.userService.currentLoggedInUser.attributes) {
      this.context.user = this.userService.currentLoggedInUser;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  routeToUpdateProfile(): void {
    this.router.navigate(['/', this.context.user.attributes.username, '_update']);
  }

  changeTab(tab): void {
    this.selectedTab = tab;
  }

  sendEmailVerificationLink(): void {
    this.subscriptions.push(this.userService.sendEmailVerificationLink()
      .subscribe(res => {
        if (res.status === 204) {
          this.notifications.message({
            message: `Email Verification link sent!`,
            type: NotificationType.SUCCESS
          } as Notification);
        } else {
          this.notifications.message({
            message: `Error sending email verification link!`,
            type: NotificationType.DANGER
          } as Notification);
        }
      }, error => {
        this.handleError('Unexpected error sending link!', NotificationType.DANGER);
      }));
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
