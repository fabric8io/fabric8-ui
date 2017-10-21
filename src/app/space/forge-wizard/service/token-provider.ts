import { Injectable } from '@angular/core';
import { AuthenticationService } from 'ngx-login-client';
import { TokenProvider } from 'ngx-forge';

@Injectable()
export class KeycloakTokenProvider extends TokenProvider {

  constructor(private authService: AuthenticationService) {
    super();
  }

  getToken(): string {
    return this.authService.getToken();
  }
}
