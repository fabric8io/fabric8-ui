import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Feature} from '../../app/models/feature';

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
  getFeatures(ids: string[]): Observable<Feature[]> {
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
    let mock = [feature];
    if (ids[0] === this.featureFlagName) {
      return Observable.of(mock);
    }
    return Observable.of([]);
  }
}
