import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Notification, NotificationType, Notifications } from 'ngx-base';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { UserService, User } from 'ngx-login-client';

import { TenentService } from '../services/tenent.service';

@Component({
  selector: 'alm-update',
  templateUrl: 'update.component.html',
  styleUrls: ['./update.component.scss'],
  providers: [TenentService]
})
export class UpdateComponent implements OnInit {

  context: Context;
  email: string;
  emailInvalid: boolean = false;
  hideName: boolean = false;
  hideEmail: boolean = false;
  loggedInUser: User;
  name: string;
  nameInvalid: boolean = false;
  subscriptions: Subscription[] = [];
  username: string;
  usernameInvalid: boolean = false;

  constructor(
      private contexts: Contexts,
      private notifications: Notifications,
      private router: Router,
      private tenentService: TenentService,
      private userService: UserService) {
    contexts.current.subscribe(val => this.context = val);
    userService.loggedInUser.subscribe(val => {
      this.loggedInUser = val;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  setElementFocus($event: MouseEvent, element: HTMLElement) {
    element.focus();
  }

  redirectToGitHubAuth(): void {

  }

  redirectToOpenShiftAuth(): void {

  }

  routeToProfile(): void {
    this.router.navigate(['/', this.context.user.attributes.username]);
  }

  updateTenent(): void {
    this.subscriptions.push(this.tenentService.updateTenent()
      .subscribe(res => {
        // Do nothing
        let test = "";
      }, error => {
        this.handleError("Failed to update tenent", NotificationType.DANGER);
      }));
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
