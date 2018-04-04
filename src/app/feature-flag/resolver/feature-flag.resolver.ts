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
import { Feature, FeatureTogglesService } from '../service/feature-toggles.service';

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
    let featureName = route.data['featureName']; // + '.*';
    return this.toggleService.getFeaturesPerPage(featureName).map((features: Feature[]) => {
      let internal: Feature[] = [];
      let experimental: Feature[] = [];
      let beta: Feature[] = [];
      let released: Feature[] = [];
      let mainFeature: Feature;
      for (let feature of features) {
        if (feature.id.indexOf('.') === -1) {
          mainFeature = feature;
        }
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
              if (feature.attributes['enabled'] && feature.attributes['user-enabled']) {
                released.push(feature);
              }
              break;
            }
        }
      }
      // this.logger.log('>> Feature = ' + featureName + ' enabled = ' + mainFeature.attributes['enabled']);
      // if no feature at page menu level, the page has only component features
      if (!mainFeature) {
        return {
          name: featureName,
          showBanner: this.getBannerColor(mainFeature.attributes['user-level']), // todo make it optional
          enabled: true, // todo make it optional
          featuresPerLevel: {
            internal,
            experimental,
            beta,
            released
          }
        } as FeatureFlagConfig;
      } else if (!mainFeature.attributes['enabled']) { // PM has disabled the feature for all users
        this.router.navigate(['/_error']);
        return null;
      } else {
        let enablementLevel = this.getBannerColor(mainFeature.attributes['enablement-level']);
        if (enablementLevel === 'notApplicable') {
          // for non-internal user trying to see internal feature toggles-service return a enablement-level null
          // route to error page.
          this.router.navigate(['/_error']);
          return null;
        } else if (mainFeature.attributes['user-enabled']) { // feature is not toggled off and user-level is enabled
          return {
            name: featureName,
            showBanner: this.getBannerColor(mainFeature.attributes['user-level']),
            enabled: mainFeature.attributes['user-enabled'],
            featuresPerLevel: {
              internal,
              experimental,
              beta,
              released
            }
          } as FeatureFlagConfig;
        } else { // feature is not toggled off but user-level is disabled, forward to opt-in page
          this.router.navigate(['/_featureflag'], {queryParams: {
              name: featureName,
              showBanner: this.getBannerColor(mainFeature.attributes['user-level']),
              enabled: mainFeature.attributes['user-enabled']
            } });
        }
      }
    }).catch (err => {
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
