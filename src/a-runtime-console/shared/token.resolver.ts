import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  NavigationEnd,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

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
