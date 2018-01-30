import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Logger } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { FeatureFlagConfig } from '../../../app/models/feature-flag-config';
import { FeatureTogglesService } from '../service/feature-toggles.service';

enum FeatureLevel {
  internal = 'internal',
  released = 'released',
  notApplicable = 'notApplicable', // non redhat user trying to access internal feature
  systemError = 'systemError', // f8-toggles-service is down, this features is disabled by PM for all level
  notLoggedIn = 'notLoggedIn',
  experimental = 'experimental',
  beta = 'beta'
}
@Injectable()
export class FeatureFlagResolver implements Resolve<FeatureFlagConfig> {

  constructor(private logger: Logger,
              private authService: AuthenticationService,
              private toggleService: FeatureTogglesService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureFlagConfig> {


    let featureName = route.data['featureName'];

    if (this.authService.isLoggedIn()) {
      return this.toggleService.getFeature(featureName).map((feature) => {
        this.logger.log('>> Feature = ' + featureName + ' enabled = ' + feature.attributes['enabled']);
        if (!feature.attributes['enabled']) { // PM has disabled the feature for all users
          this.router.navigate(['/_error']);
          return null;
        } else {
          let enablementLevel = this.getBannerColor(feature.attributes['enablement-level']);
          if (enablementLevel === 'notApplicable') {
            // for non-internal user trying to see internal feature toggles-service return a enablement-level null
            // route to error page.
            this.router.navigate(['/_error']);
            return null;
          } else {
            return { // feature is not toggled off, check user's level
              name: featureName,
              showBanner: this.getBannerColor(feature.attributes['enablement-level']),
              enabled: feature.attributes['user-enabled']
            } as FeatureFlagConfig;
          }
        }
      }).catch(err => {
        return Observable.of({
          name: featureName,
          showBanner: FeatureLevel.systemError,
          enabled: true // if the f8-toggles-service is down, make the feature available with a systemError banner
        } as FeatureFlagConfig);
      });
    } else {
      this.logger.log('>> Feature = ' + featureName + ' is NOT enabled for non-logged in user.');
      return Observable.of({
        name: featureName,
        showBanner: FeatureLevel.notLoggedIn,
        enabled: true // TODO: what do we show to non-logged in user? to show or not to show?
      } as FeatureFlagConfig);
    }
  }

  private getBannerColor(level: string): string {
    if (!level) {
      return FeatureLevel.notApplicable as string;
    }
    if (level.toLocaleLowerCase() === 'beta') {
      return FeatureLevel.beta as string;
    }
    if (level.toLocaleLowerCase() === 'released') {
      return FeatureLevel.released as string;
    }
    if (level.toLocaleLowerCase() === 'internal') {
      return FeatureLevel.internal as string;
    }
    if (level.toLocaleLowerCase() === 'experimental') {
      return FeatureLevel.experimental as string;
    }
    return FeatureLevel.notApplicable as string;
  }

}
