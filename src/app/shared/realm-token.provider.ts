import { REALM } from 'ngx-login-client';

import { ApiLocatorService } from './api-locator.service';

let realmFactory = (api: ApiLocatorService) => {
  return api.realm;
};

export let realmProvider = {
  provide: REALM,
  useFactory: realmFactory,
  deps: [ApiLocatorService]
};
