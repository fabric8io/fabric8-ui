import { Navigation } from './../models/navigation';
import { Observable, ConnectableObservable, Subject, BehaviorSubject } from 'rxjs';
import { AuthenticationService, UserService, User } from 'ngx-login-client';
import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  NavigationEnd,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { FeatureFlagConfig } from '../models/feature-flag-config';

@Injectable()
export class ExperimentalFeatureResolver implements Resolve<FeatureFlagConfig> {

  constructor(private router: Router, private userService: UserService, private authService: AuthenticationService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureFlagConfig> {
    let featureName = route.data["featureName"];
    let experimentalFeaturesEnabled = true;
    if(this.authService.isLoggedIn()) {
      return this.userService.loggedInUser.map((user) => {
        let loggedInUser = user;
        // Resolve the context
        let experimentalFeaturesEnabled = false;
        if (loggedInUser && loggedInUser.attributes) {
          let contextInformation = loggedInUser.attributes["contextInformation"];
          if (contextInformation && contextInformation.experimentalFeatures ) {
            experimentalFeaturesEnabled =  contextInformation.experimentalFeatures["enabled"];
          }
        }
        return {
          name: featureName,
          showBanner: true,
          enabled: experimentalFeaturesEnabled
        } as FeatureFlagConfig;
      }).take(1);
    } else  {
      // enable experimental features for all non-logged in users
      experimentalFeaturesEnabled = true;
      return Observable.of({
        name: featureName,
        showBanner: true,
        enabled: experimentalFeaturesEnabled
      } as FeatureFlagConfig);
    }
  }

}
