import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Logger } from 'ngx-base';
import { Observable } from 'rxjs';
import { FeatureFlagConfig } from '../../../app/models/feature-flag-config';
import { FeatureTogglesService } from '../service/feature-toggles.service';

enum FeatureLevel {
  internal = 'internal',
  released = 'released',
  notApplicable = 'notApplicable', // non redhat user trying to access internal feature
  systemError = 'systemError', // f8-toggles-service is down, this features is disabled by PM for all level
  experimental = 'experimental',
  beta = 'beta'
}
@Injectable()
export class FeatureFlagResolver implements Resolve<FeatureFlagConfig> {

  constructor(private logger: Logger,
              private toggleService: FeatureTogglesService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureFlagConfig> {
    let featureName = route.data['featureName'];
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
        } else if (feature.attributes['user-enabled']) { // feature is not toggled off and user-level is enabled
          return {
            name: featureName,
            showBanner: this.getBannerColor(feature.attributes['enablement-level']),
            enabled: feature.attributes['user-enabled']
          } as FeatureFlagConfig;
        } else { // feature is not toggled off but user-level is disabled, forward to opt-in page
          this.router.navigate(['/_featureflag'], {queryParams: {
              name: featureName,
              showBanner: this.getBannerColor(feature.attributes['enablement-level']),
              enabled: feature.attributes['user-enabled']
            } });
        }
      }
    }).catch(err => {
      return Observable.of({
        name: featureName,
        showBanner: FeatureLevel.systemError,
        enabled: true // if the f8-toggles-service is down, make the feature available with a systemError banner
      } as FeatureFlagConfig);
    });
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
