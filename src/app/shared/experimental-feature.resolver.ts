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

  private _loggedInUser: User;

  constructor(private router: Router, private userService: UserService, private authService: AuthenticationService) {
    if(authService.isLoggedIn()) {
      userService.loggedInUser.subscribe((user) => {
        this._loggedInUser = user;
      });
    }
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureFlagConfig> {
    // Resolve the context
    let featureName = route.data["featureName"];
    let experimentalFeaturesEnabled = false;
    if (this._loggedInUser && this._loggedInUser.attributes) {
      let contextInformation = this._loggedInUser.attributes["contextInformation"];
      if (contextInformation && contextInformation.experimentalFeatures ) {
        experimentalFeaturesEnabled =  contextInformation.experimentalFeatures["enabled"];
      }
    }

    if (!this.authService.isLoggedIn()) {
      // enable experimental features for all non-logged in users
      experimentalFeaturesEnabled = true;
    }

    return Observable.of({
      name: featureName,
      showBanner: true,
      enabled: experimentalFeaturesEnabled
    } as FeatureFlagConfig);
  }

}
