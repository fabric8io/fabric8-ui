import {
  Component,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';

import 'rxjs/operators/map';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { ErrorService } from './error.service';

import { UserService, User, AuthenticationService } from 'ngx-login-client';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.less']
})
export class ErrorComponent implements OnDestroy {

  message: string = '';
  subscription: Subscription;
  hideBanner: boolean;
  spaceLink: string;
  userSubscription: Subscription;

  constructor(private errorService: ErrorService,
                      router: Router,
                      userService: UserService,
                      authService: AuthenticationService) {
    this.subscription = this.errorService.update$.subscribe(
      message => {
        this.message = message;
      });

    if (authService.isLoggedIn()) {
      this.userSubscription = userService.loggedInUser.subscribe(val => {
        if (val.id) {
          this.spaceLink = '/' + val.attributes.username + '/_spaces';
        }
      });
    } else {
      this.spaceLink = '/_home';
    }
  }
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
