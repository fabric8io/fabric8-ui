import { AUTH_API_URL, WIT_API_PROXY } from 'ngx-login-client';
import { ApiLocatorService } from './api-locator.service';

let authApiUrlFactory = (api: ApiLocatorService) => api.authApiUrl;

export let authApiUrlProvider = {
  provide: AUTH_API_URL,
  useFactory: authApiUrlFactory,
  deps: [ApiLocatorService],
};

let witApiProxyFactory = (api: ApiLocatorService) => api.witApiUrl;

export let witApiProxyProvider = {
  provide: WIT_API_PROXY,
  useFactory: witApiProxyFactory,
  deps: [ApiLocatorService],
};
