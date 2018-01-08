import { WIT_API_URL } from 'ngx-fabric8-wit';

import { ApiLocatorService } from './api-locator.service';

let witApiUrlFactory = (api: ApiLocatorService) => {
  return api.witApiUrl;
};

export let witApiUrlProvider = {
  provide: WIT_API_URL,
  useFactory: witApiUrlFactory,
  deps: [ApiLocatorService]
};
