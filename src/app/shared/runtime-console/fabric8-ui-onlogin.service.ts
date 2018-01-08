import { Injectable } from '@angular/core';

import { OnLogin } from '../../../a-runtime-console/index';
import { LoginService } from '../login.service';

@Injectable()
export class Fabric8UIOnLogin implements OnLogin {

  constructor(
    private loginService: LoginService
  ) {

  }

  // TODO - remove this in favor of handling all tokens through ngx-login-client
  get token(): string {
    return this.loginService.openShiftToken;
  }

  public onLogin(token: string) {
    // Not needed
  }
}
