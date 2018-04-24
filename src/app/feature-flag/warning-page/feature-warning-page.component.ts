import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { AuthenticationService, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';
import 'rxjs/operators/map';

@Component({
  selector: 'f8-feature-warning-page',
  templateUrl: './feature-warning-page.component.html',
  styleUrls: ['./feature-warning-page.component.less']
})
export class FeatureWarningPageComponent implements OnInit, OnDestroy {

  enableFeatures: boolean;
  @Input() level: string;
  profileSettingsLink: string;
  private userSubscription: Subscription;

  constructor(private userService: UserService,
  private authService: AuthenticationService) {
    if (authService.isLoggedIn()) {
      this.userSubscription = userService.loggedInUser.subscribe(val => {
        if (val.id) {
          this.profileSettingsLink = '/' + val.attributes.username + '/_settings/feature-opt-in';
        }
      });
    } else {
      this.profileSettingsLink = '/_home';
    }
  }

  ngOnInit() {
    this.enableFeatures = false;
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
