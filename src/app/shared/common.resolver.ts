import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import {
  UserService
} from 'ngx-login-client';

@Injectable()
export class AuthUserResolve implements Resolve<any> {
  constructor(private userService: UserService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.userService.getUser();
  }
}



