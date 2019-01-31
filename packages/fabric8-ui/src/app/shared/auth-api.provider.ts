import { AUTH_API_URL, WIT_API_PROXY } from 'ngx-login-client';
import { ApiLocatorService } from './api-locator.service';

const authApiUrlFactory = (api: ApiLocatorService) => api.authApiUrl;

export const authApiUrlProvider = {
  provide: AUTH_API_URL,
  useFactory: authApiUrlFactory,
  deps: [ApiLocatorService],
};

const witApiProxyFactory = (api: ApiLocatorService) => api.witApiUrl;

export const witApiProxyProvider = {
  provide: WIT_API_PROXY,
  useFactory: witApiProxyFactory,
  deps: [ApiLocatorService],
};
