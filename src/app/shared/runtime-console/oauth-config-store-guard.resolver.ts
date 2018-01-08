import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { Fabric8RuntimeConsoleService } from './fabric8-runtime-console.service';

// Basic guard that checks the user is logged in
@Injectable()
export class Fabric8RuntimeConsoleResolver implements Resolve<boolean> {

  constructor(
    private fabric8RuntimeConsole: Fabric8RuntimeConsoleService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.fabric8RuntimeConsole.loading();
  }

}
