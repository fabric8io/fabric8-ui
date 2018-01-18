import { Location } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs';
//import { FABRIC8_FEATURE_TOGGLES_API_URL } from '../../../a-runtime-console/shared/feature-toggles.provider';

@Injectable()
export class FeatureTogglesService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private featureTogglesUrl: string;

  constructor(
    private http: Http,
    private logger: Logger,
    private auth: AuthenticationService,
    //@Inject(FABRIC8_FEATURE_TOGGLES_API_URL) apiUrl: string) {
    @Inject(WIT_API_URL) apiUrl: string) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.featureTogglesUrl = apiUrl;
  }

  /**
   * Check if a given feature id is user-enabled for a given user (the user identity being carried with auth token).
   * It also return if the feature is enabled for any users.
   * @returns {Observable<Feature>}
   */
  getFeature(id: string): Observable<Feature> {
    let url = Location.stripTrailingSlash(this.featureTogglesUrl || '') + '/features/' + id;
    return this.http.get(url, { headers: this.headers })
      .map((response) => {
        return response.json().data as Feature;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }
  /**
   * Check if a given list of feature ids are enabled (retrieve user-enabled and enabled).
   * @param ids An arrays of feature Id.
   * @returns {Observable<Feature>}
   */
  getFeatures(ids: string[]): Observable<Feature[]> {
    let url = Location.stripTrailingSlash(this.featureTogglesUrl || '') + '/features';
    let params = [];
    params['names'] = ids;

    return this.http.get(url, { headers: this.headers, params: params })
      .map((response) => {
        return response.json().data as Feature[];
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }
}
export class Feature {
  attributes: FeatureAttributes;
  id?: string;
}

export class FeatureAttributes {
  'name': string;
  'description'?: string;
  // feature is enabled at feature level.
  'enabled'?: boolean;
  'enablement-level'?: string;
  // user has the enablement-level that make this feature enabled.
  'user-enabled'?: boolean;
}
