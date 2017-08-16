import { OpaqueToken } from '@angular/core';
import { REALM } from 'ngx-login-client';

let realmFactory = () => {
  return process.env.FABRIC8_REALM;
};

export let realmProvider = {
  provide: REALM,
  useFactory: realmFactory
};
