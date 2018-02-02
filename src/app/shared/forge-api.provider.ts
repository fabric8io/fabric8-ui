import { ApiLocatorService } from './api-locator.service';

import { FABRIC8_FORGE_API_URL } from './runtime-console/fabric8-ui-forge-api';

let forgeApiUrlFactory = (api: ApiLocatorService) => {
  return api.forgeApiUrl;
};

export let forgeApiUrlProvider = {
  provide: FABRIC8_FORGE_API_URL,
  useFactory: forgeApiUrlFactory,
  deps: [ApiLocatorService]
};
