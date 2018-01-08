import { SSO_API_URL } from 'ngx-login-client';

import { ApiLocatorService } from './api-locator.service';

let ssoApiUrlFactory = (api: ApiLocatorService) => {
  return api.ssoApiUrl;
};

export let ssoApiUrlProvider = {
  provide: SSO_API_URL,
  useFactory: ssoApiUrlFactory,
  deps: [ApiLocatorService]
};
