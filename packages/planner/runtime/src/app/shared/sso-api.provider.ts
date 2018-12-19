import { SSO_API_URL } from 'ngx-login-client';

let ssoApiUrlFactory = () => {
  console.log('Using as SSO url: ' + process.env.FABRIC8_SSO_API_URL);
  return process.env.FABRIC8_SSO_API_URL;
};

export let ssoApiUrlProvider = {
  provide: SSO_API_URL,
  useFactory: ssoApiUrlFactory,
};
