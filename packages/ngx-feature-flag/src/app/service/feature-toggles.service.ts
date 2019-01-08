import { Location } from '@angular/common';
import { ErrorHandler, Inject, Injectable, InjectionToken } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { Feature } from '../models/feature';

export let FABRIC8_FEATURE_TOGGLES_API_URL = new InjectionToken('fabric8.feature.toggles.api.url');

let featureTogglesApiUrlFactory = () => {
  return process.env.FABRIC8_FEATURE_TOGGLES_API_URL;
};

export let featureTogglesApiUrlProvider = {
  provide: FABRIC8_FEATURE_TOGGLES_API_URL,
  useFactory: featureTogglesApiUrlFactory
};

@Injectable()
export class FeatureTogglesService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private featureTogglesUrl: string;
  _featureFlagCache: Map<string, Feature[]>;

  constructor(
    private http: Http,
    private errorHandler: ErrorHandler,
    private auth: AuthenticationService,
    @Inject(FABRIC8_FEATURE_TOGGLES_API_URL) apiUrl: string) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.featureTogglesUrl = apiUrl;
    this._featureFlagCache = new Map<string, Feature[]>();
  }

  /**
   * Check if a given feature id is user-enabled for a given user (the user identity being carried with auth token).
   * It also return if the feature is enabled for any users.
   * @deprecated
   * @returns {Observable<Feature>}
   */
  getFeature(id: string): Observable<Feature> {
    if (!id || id.length === 0) {
      return this.handleError('Feature-flag service needs an non-empty id');
    }
    let url = Location.stripTrailingSlash(this.featureTogglesUrl || '') + '/features/' + id;
    const names = id.split('.');
    const cachedFeatures = this._featureFlagCache.get(names[0]);
    if (cachedFeatures) {
      const found = cachedFeatures.find(e => e.id === id);
      if (found) {
        return Observable.of(found);
      }
    }
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
    let params: {[key: string]: string[]} = {};
    params['names'] = ids;

    return this.http.get(url, { headers: this.headers, params: params })
      .map((response) => {
        return response.json().data as Feature[];
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Check if a given list of feature ids are enabled (retrieve user-enabled and enabled).
   * This method is called by FeatureFlagResolver each time a user changed menu (when the menu
   * contains feature-flag). In this method, the feature flags used for components are cached
   * per page.
   * @param group An string to represent the logical page grouping of the feature.
   * For example a feature name Analyze.dashboard, culd be retrieve with group = Analyse.
   * @returns {Observable<Feature>}
   */
  getFeaturesPerPage(group: string): Observable<Feature[]> {
    let url = Location.stripTrailingSlash(this.featureTogglesUrl || '') + '/features';
    let params: {[key: string]: string} = {};
    params['group'] = group;

    return this.http.get(url, { headers: this.headers, params: params })
      .map((response) => {
        return response.json().data as Feature[];
      })
      // Update features cache if required
      .map(features => {
        this._featureFlagCache.set(group, features);
        return features;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Retrieve the list of features that used the strategy `enableByLevel` on unleash server.
   * This method is called by FeatureFlagResolver each time a user changed menu (when the menu
   * contains feature-flag).
   * @returns {Observable<Feature>}
   */
  getAllFeaturesEnabledByLevel(): Observable<Feature[]> {
    let url = Location.stripTrailingSlash(this.featureTogglesUrl || '') + '/features';
    let params: {[key: string]: string} = {};
    params['strategy'] = 'enableByLevel';

    return this.http.get(url, { headers: this.headers, params: params })
      .map((response) => {
        return response.json().data as Feature[];
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  private handleError(error: any) {
    this.errorHandler.handleError(error);
    return Observable.throw(error.message || error);
  }
}
