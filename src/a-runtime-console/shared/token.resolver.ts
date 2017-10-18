import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  NavigationEnd,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { LoginService } from './login.service';
import { AuthenticationService } from 'ngx-login-client';

@Injectable()
export class TokenResolver implements Resolve<string> {

  constructor(private authService: AuthenticationService, private loginService: LoginService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    // Make sure the openshift token is available
    if (!this.loginService.useCustomAuth && this.authService.isLoggedIn()) {
      return this.authService.getOpenShiftToken();
    }
    return Observable.of('');
  }

}
