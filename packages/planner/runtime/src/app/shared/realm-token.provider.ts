import { REALM } from 'ngx-login-client';

let realmFactory = () => {
  console.log('Using Keycloak realm: ' + process.env.FABRIC8_REALM);
  return process.env.FABRIC8_REALM;
};

export let realmProvider = {
  provide: REALM,
  useFactory: realmFactory,
};
