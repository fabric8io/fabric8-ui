import { Injectable } from '@angular/core';
import { AuthenticationService } from 'ngx-login-client';
import { forkJoin as observableForkJoin,  Observable } from 'rxjs';
import { first, map, skipWhile, tap } from 'rxjs/operators';
import { OAuthConfigStore } from '../../../a-runtime-console/index';
import { LoginService } from '../login.service';

@Injectable()
export class Fabric8RuntimeConsoleService {

  constructor(
    private login: LoginService,
    private auth: AuthenticationService,
    private oAuthConfigStore: OAuthConfigStore
  ) { }

  loading(): Observable<boolean> {
    return observableForkJoin(this.loadingOAuthConfigStore(), this.loadingOpenShiftToken(), () => true);
  }

  loadingOAuthConfigStore(): Observable<boolean> {
    return this.oAuthConfigStore.loading.pipe(
      // Wait until loaded
      skipWhile(loading => loading),
      // Take the first false as done
      first()
    );
  }

  loadingOpenShiftToken(): Observable<boolean> {
    return this.auth.getOpenShiftToken().pipe(
      tap(token => this.login.openShiftToken = token),
      map(() => true),
      first()
    );
  }

}
