import { Injectable } from '@angular/core';

import { TokenProvider } from 'ngx-forge';
import { AuthenticationService } from 'ngx-login-client';

@Injectable()
export class KeycloakTokenProvider extends TokenProvider {

  constructor(private authService: AuthenticationService) {
    super();
  }

  getToken(): string {
    return this.authService.getToken();
  }
}
