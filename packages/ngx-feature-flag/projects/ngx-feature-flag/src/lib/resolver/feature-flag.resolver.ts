import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { UserService } from 'ngx-login-client-fork';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Feature } from '../models/feature';
import { FeatureFlagConfig } from '../models/feature-flag-config';
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
  userLevel: string = 'released';

  constructor(
    private toggleService: FeatureTogglesService,
    private router: Router,
    private userService: UserService
  ) {
    if (this.userService.currentLoggedInUser && this.userService.currentLoggedInUser.attributes) {
      this.userLevel = (this.userService.currentLoggedInUser.attributes as any).featureLevel;
    }
  }

  buildFeaturePerLevelView(features: Feature[], userLevel: string): FeatureFlagConfig {
    let internal: Feature[] = [];
    let experimental: Feature[] = [];
    let beta: Feature[] = [];
    let mainFeature: Feature;
    for (let feature of features) {
      if (feature.id.indexOf('.') === -1) {
        mainFeature = feature;
      }
      feature.attributes.name = feature.id.replace('.', ' ');
      switch (feature.attributes['enablement-level']) {
        case 'beta': {
          if (feature.attributes['enabled'] && feature.attributes['user-enabled']) {
            beta.push(feature);
          }
          break;
        }
        case 'experimental': {
          if (feature.attributes['enabled'] && feature.attributes['user-enabled']) {
            experimental.push(feature);
          }
          break;
        }
        case 'internal': {
          if (feature.attributes['enabled'] && feature.attributes['user-enabled']) {
            internal.push(feature);
          }
          break;
        }
        default: {
          break;
        }
      }
    }
    // this.logger.log('>> Feature = ' + featureName + ' enabled = ' + mainFeature.attributes['enabled']);
    // if no feature at page menu level, the page has only component featuresmergeMa
    if (!mainFeature) {
      return {
        'user-level': this.userLevel,
        featuresPerLevel: {
          internal,
          experimental,
          beta
        }
      } as FeatureFlagConfig;
    } else if (!mainFeature.attributes['enabled']) { // PM has disabled the feature for all users
      return null;
    } else {
      let enablementLevel = this.getBannerColor(mainFeature.attributes['enablement-level']);
      if (enablementLevel === 'notApplicable') {
        // for non-internal user trying to see internal feature toggles-service return a enablement-level null
        // route to error page.
        return null;
      } else if (mainFeature.attributes['user-enabled']) { // feature is not toggled off and user-level is enabled
        return {
          'user-level': this.userLevel,
          featuresPerLevel: {
            internal,
            experimental,
            beta
          }
        } as FeatureFlagConfig;
      } else { // feature is not toggled off but user-level is disabled, forward to opt-in page
        return {
          showBanner: this.getBannerColor(mainFeature.attributes['enablement-level'])
        };
      }
    }
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureFlagConfig> {
    let featureName = route.data['featureName']; // + '.*';
    if (this.userService.currentLoggedInUser && this.userService.currentLoggedInUser.attributes) {
      this.userLevel = (this.userService.currentLoggedInUser.attributes as any).featureLevel;
    }
    return this.toggleService.getFeaturesPerPage(featureName)
      .pipe(map((features: Feature[]) => {
        let config = this.buildFeaturePerLevelView(features, this.userLevel);
        if (config == null) {
          this.router.navigate(['/_error']);
        } else if (!config.featuresPerLevel) {
          this.router.navigate(['/_featureflag'], { queryParams: { showBanner: config.showBanner } });
          return null;
        }
        return config;
      }), catchError(err => {
        return of({
          showBanner: FeatureLevel.systemError
        } as FeatureFlagConfig);
      }));
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
