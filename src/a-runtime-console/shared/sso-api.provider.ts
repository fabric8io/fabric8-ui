import { OpaqueToken } from '@angular/core';
import { SSO_API_URL } from 'ngx-login-client';

let ssoApiUrlFactory = () => {
  return process.env.FABRIC8_SSO_API_URL;
};

export let ssoApiUrlProvider = {
  provide: SSO_API_URL,
  useFactory: ssoApiUrlFactory
};
