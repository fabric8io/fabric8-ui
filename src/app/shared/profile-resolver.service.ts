import { Observable } from 'rxjs';
import { UserService, User } from 'ngx-login-client';
import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
@Injectable()
export class ProfileResolver implements Resolve<boolean> {

  constructor(private userService: UserService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // Resolve the context
    return this.userService.loggedInUser.map((userName) => {
      this.router.navigate(['/', userName.attributes.username]);
      return false;
    }).take(1);
  }

}
