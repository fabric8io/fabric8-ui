import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Feature } from '../../../projects/ngx-feature-flag/src/lib//models/feature';

@Injectable()
export class FeatureTogglesServiceMock  {
  featureFlagName: string;
  featureFlagEnablementLevel: string;
  featureFlagEnable: boolean;
  userLevel: string;

  isUserLevelEnabled(): boolean {
    if (this.userLevel === 'internal') {
      return true;
    }
    if (this.userLevel === 'experimental') {
      if (this.featureFlagEnablementLevel === 'internal') {
        return false;
      }
      return true;
    }
    if (this.userLevel === 'beta') {
      if (this.featureFlagEnablementLevel === 'internal' || this.featureFlagEnablementLevel === 'experimental') {
        return false;
      }
      return true;
    }
    if (this.userLevel === 'released') {
      if (this.featureFlagEnablementLevel === 'internal' || this.featureFlagEnablementLevel === 'experimental' || this.featureFlagEnablementLevel === 'beta') {
        return false;
      }
      return true;
    }
    return false;
  }
  getFeature(id: string): Observable<Feature> {
    const feature =  {
      attributes: {
        'user-enabled': this.isUserLevelEnabled(),
        'enabled': this.featureFlagEnable,
        'enablement-level': this.featureFlagEnablementLevel,
        'description': 'description',
        'name': this.featureFlagName
      },
      id: this.featureFlagName
    } as Feature;

    if (id === this.featureFlagName) {
      return of(feature);
    }
    return of();
  }
  isFeatureUserEnabled(id: string): Observable<{} | boolean> {
    const feature =  {
      attributes: {
        'user-enabled': this.isUserLevelEnabled(),
        'enabled': this.featureFlagEnable,
        'enablement-level': this.featureFlagEnablementLevel,
        'description': 'description',
        'name': this.featureFlagName
      },
      id: this.featureFlagName
    } as Feature;

    if (id === this.featureFlagName) {
      if (feature.attributes) {
        return of(feature.attributes.enabled && feature.attributes['user-enabled']);
      } else {
        return of(false);
      }
    }
    return of();
  }
}
