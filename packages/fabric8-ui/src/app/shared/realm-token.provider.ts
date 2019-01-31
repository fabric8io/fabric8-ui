import { REALM } from 'ngx-login-client';
import { ApiLocatorService } from './api-locator.service';

const realmFactory = (api: ApiLocatorService) => api.realm;

export const realmProvider = {
  provide: REALM,
  useFactory: realmFactory,
  deps: [ApiLocatorService],
};
