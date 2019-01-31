import { ApiLocatorService } from './api-locator.service';
import { FABRIC8_FORGE_API_URL } from './runtime-console/fabric8-ui-forge-api';

const forgeApiUrlFactory = (api: ApiLocatorService) => api.forgeApiUrl;

export const forgeApiUrlProvider = {
  provide: FABRIC8_FORGE_API_URL,
  useFactory: forgeApiUrlFactory,
  deps: [ApiLocatorService],
};
