import { Location } from '@angular/common';
import {
  Component,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';

import { AuthenticationService, User, UserService } from 'ngx-login-client';
import 'rxjs/operators/map';
import { Subscription } from 'rxjs/Subscription';

import { ErrorService } from './error.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.less']
})
export class ErrorComponent implements OnDestroy {

  spaceLink: string = '';

  private subscriptions: Subscription[] = [];

  constructor(
    private errorService: ErrorService,
    private userService: UserService,
    private authService: AuthenticationService,
    private location: Location
  ) {
    this.subscriptions.push(
      this.errorService.failedRoute$.subscribe((route: string): void => {
        if (route) {
          this.location.replaceState(route);
        }
      })
    );

    if (this.authService.isLoggedIn()) {
      this.subscriptions.push(this.userService.loggedInUser.subscribe((user: User): void => {
        if (user.id) {
          this.spaceLink = '/' + user.attributes.username + '/_spaces';
        }
      }));
    } else {
      this.spaceLink = '/_home';
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

}
