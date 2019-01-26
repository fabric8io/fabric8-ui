import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Notifications, NotificationType } from 'ngx-base';
import { Context } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ContextService } from '../../shared/context.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['./overview.component.less'],
})
export class OverviewComponent implements OnDestroy, OnInit {
  user: User;

  viewingOwnAccount: boolean;

  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly notifications: Notifications,
    private readonly contextService: ContextService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.contextService.current.pipe(map((context: Context): User => context.user)).subscribe(
        (user: User): void => {
          this.viewingOwnAccount = this.contextService.viewingOwnContext();
          if (!!user.attributes) {
            this.user = user;
          }
        },
      ),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

  routeToUpdateProfile(): void {
    this.router.navigate(['/', this.user.attributes.username, '_update']);
  }

  sendEmailVerificationLink(): void {
    this.userService
      .sendEmailVerificationLink()
      .pipe(first())
      .subscribe(
        (res: HttpResponse<any>): void => {
          if (res.status === 204) {
            this.notifications.message({
              message: 'Email Verification link sent!',
              type: NotificationType.SUCCESS,
            });
          } else {
            this.notifications.message({
              message: 'Error sending email verification link!',
              type: NotificationType.DANGER,
            });
          }
        },
        () => {
          this.handleError('Unexpected error sending link!', NotificationType.DANGER);
        },
      );
  }

  private handleError(error: string, type: NotificationType): void {
    this.notifications.message({
      message: error,
      type: type,
    });
  }
}
