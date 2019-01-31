import { FABRIC8_FEATURE_TOGGLES_API_URL } from 'ngx-feature-flag';
import { ApiLocatorService } from './api-locator.service';

const witApiUrlFactory = (api: ApiLocatorService) => api.witApiUrl;

// for now use wit proxy for toggles-services
export const togglesApiUrlProvider = {
  provide: FABRIC8_FEATURE_TOGGLES_API_URL,
  useFactory: witApiUrlFactory,
  deps: [ApiLocatorService],
};
