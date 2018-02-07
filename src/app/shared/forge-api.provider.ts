import { ApiLocatorService } from './api-locator.service';

import { FABRIC8_FORGE_API_URL } from '../../a-runtime-console/index';

let forgeApiUrlFactory = (api: ApiLocatorService) => {
  return api.forgeApiUrl;
};

export let forgeApiUrlProvider = {
  provide: FABRIC8_FORGE_API_URL,
  useFactory: forgeApiUrlFactory,
  deps: [ApiLocatorService]
};
