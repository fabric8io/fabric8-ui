import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { UserService, User } from 'ngx-login-client';

@Component({
  selector: 'f8-exp-feature-banner',
  templateUrl: './exp-feature-banner.component.html'
})
export class ExpFeatureBannerComponent implements OnInit, OnDestroy {

  public loggedInUser: User;
  public hideBanner: boolean;
  private userSubscription: Subscription;

  constructor(public router: Router,
              userService: UserService) {

    this.userSubscription = userService.loggedInUser.subscribe(val => {
      if (val.id) {
        this.loggedInUser = val;
      }
    });
  }

  ngOnInit() {
    this.hideBanner = false;
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  acknowledgeWarning() {
    this.hideBanner = true;
  }
}
