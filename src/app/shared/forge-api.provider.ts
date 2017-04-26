import { OpaqueToken } from '@angular/core'

import { ApiLocatorService } from './api-locator.service';

import { FABRIC8_FORGE_API_URL } from 'fabric8-runtime-console';

let forgeApiUrlFactory = (api: ApiLocatorService) => {
  return api.forgeApiUrl;
};

export let forgeApiUrlProvider = {
  provide: FABRIC8_FORGE_API_URL,
  useFactory: forgeApiUrlFactory,
  deps: [ApiLocatorService]
};
