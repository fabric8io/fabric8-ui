import { Injectable } from '@angular/core';
import { OpaqueToken } from '@angular/core';

import { URLProvider } from 'ngx-launcher';

import { ApiLocatorService } from '../../../shared/api-locator.service';

export let ANALYTICS_RECOMMENDER_URL = new OpaqueToken('analytics.recommender.url');
export let ANALYTICS_LICENSE_URL = new OpaqueToken('analytics.license.url');

let analyticsRecommendeApiUrlFactory = (api: ApiLocatorService) => {
  return api.analyticsRecommenderApiUrl;
};

let analyticsLicenseApiUrlFactory = (api: ApiLocatorService) => {
    return api.analyticsLicenseApiUrl;
};

export let analyticsRecommendeApiUrlProvider = {
  provide: ANALYTICS_RECOMMENDER_URL,
  useFactory: analyticsLicenseApiUrlFactory,
  deps: [ApiLocatorService]
};

export let analyticsLicenseApiUrlProvider = {
    provide: ANALYTICS_LICENSE_URL,
    useFactory: analyticsLicenseApiUrlFactory,
    deps: [ApiLocatorService]
};


@Injectable()
export class AnalyticsUrlService extends URLProvider {

    constructor(private api: ApiLocatorService) {
        super();
    }

    getRecommenderAPIUrl(): string {
        return this.api.analyticsRecommenderApiUrl || '';
    }

    getLicenseAPIUrl(): string {
        return this.api.analyticsLicenseApiUrl || '';
    }

}
