import { InjectionToken } from '@angular/core';
import { FABRIC8_FEATURE_TOGGLES_API_URL } from 'ngx-feature-flag';

let witApiUrlFactory = () => {
  return process.env.FABRIC8_WIT_API_URL;
};

// for now use wit proxy for toggles-services
export let togglesApiUrlProvider = {
  provide: FABRIC8_FEATURE_TOGGLES_API_URL as InjectionToken<string>,
  useFactory: witApiUrlFactory,
};
