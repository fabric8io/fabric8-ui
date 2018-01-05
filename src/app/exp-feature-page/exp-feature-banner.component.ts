import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { UserService, User, AuthenticationService } from 'ngx-login-client';

@Component({
  selector: 'f8-exp-feature-banner',
  templateUrl: './exp-feature-banner.component.html'
})
export class ExpFeatureBannerComponent implements OnInit, OnDestroy {

  public hideBanner: boolean;
  public profileLink: string;
  private userSubscription: Subscription;

  constructor(public router: Router,
              userService: UserService,
              authService: AuthenticationService) {

    if (authService.isLoggedIn()) {
      this.userSubscription = userService.loggedInUser.subscribe(val => {
        if (val.id) {
          this.profileLink = '/' + val.attributes.username + '/_update';
        }
      });
    } else {
      this.profileLink = '/_home';
    }
  }

  ngOnInit() {
    this.hideBanner = false;
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  acknowledgeWarning() {
    this.hideBanner = true;
  }
}
