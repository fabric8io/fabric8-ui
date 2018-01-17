import { OpaqueToken } from '@angular/core';

export let FABRIC8_FEATURE_TOGGLES_API_URL = new OpaqueToken('fabric8.feature.toggles.api.url');


let featureTogglesApiUrlFactory = () => {
  return process.env.FABRIC8_FEATURE_TOGGLES_API_URL;
};

export let featureTogglesApiUrlProvider = {
  provide: FABRIC8_FEATURE_TOGGLES_API_URL,
  useFactory: featureTogglesApiUrlFactory
};
