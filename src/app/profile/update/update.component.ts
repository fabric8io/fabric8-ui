import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router  } from '@angular/router';

import { Context, Contexts } from 'ngx-fabric8-wit';
import { UserService, User } from 'ngx-login-client';

@Component({
  selector: 'alm-update',
  templateUrl: 'update.component.html',
  styleUrls: ['./update.component.scss']
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
  username: string;
  usernameInvalid: boolean = false;

  constructor(
      private contexts: Contexts,
      private router: Router,
      userService: UserService) {
    contexts.current.subscribe(val => this.context = val);
    userService.loggedInUser.subscribe(val => {
      this.loggedInUser = val;
    });
  }

  ngOnInit() {

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
}
