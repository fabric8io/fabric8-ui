import { ApiLocatorService } from './api-locator.service';
import { AUTH_API_URL } from 'ngx-login-client';

let authApiUrlFactory = (api: ApiLocatorService) => {
  return api.authApiUrl;
};

export let authApiUrlProvider = {
  provide: AUTH_API_URL,
  useFactory: authApiUrlFactory,
  deps: [ApiLocatorService]
};
