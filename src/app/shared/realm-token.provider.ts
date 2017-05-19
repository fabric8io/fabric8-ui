import { ApiLocatorService } from './api-locator.service';
import { REALM } from 'ngx-login-client';

let realmFactory = (api: ApiLocatorService) => {
  return api.realm;
};

export let realmProvider = {
  provide: REALM,
  useFactory: realmFactory,
  deps: [ApiLocatorService]
};
