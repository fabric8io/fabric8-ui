import { SSO_API_URL } from 'ngx-login-client';
import { ApiLocatorService } from './api-locator.service';

const ssoApiUrlFactory = (api: ApiLocatorService) => api.ssoApiUrl;

export const ssoApiUrlProvider = {
  provide: SSO_API_URL,
  useFactory: ssoApiUrlFactory,
  deps: [ApiLocatorService],
};
