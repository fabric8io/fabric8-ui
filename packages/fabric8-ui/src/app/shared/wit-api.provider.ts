import { WIT_API_URL } from 'ngx-fabric8-wit';
import { ApiLocatorService } from './api-locator.service';

const witApiUrlFactory = (api: ApiLocatorService) => api.witApiUrl;

export const witApiUrlProvider = {
  provide: WIT_API_URL,
  useFactory: witApiUrlFactory,
  deps: [ApiLocatorService],
};
