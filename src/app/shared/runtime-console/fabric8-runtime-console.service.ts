import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



import { OAuthConfigStore } from 'fabric8-runtime-console';

import { LoginService } from './../login.service';
import {AuthenticationService} from "../authentication.service";

@Injectable()
export class Fabric8RuntimeConsoleService {

  constructor(
    private login: LoginService,
    private auth: AuthenticationService,
    private oAuthConfigStore: OAuthConfigStore
  ) { }

  loading(): Observable<boolean> {
    return Observable.forkJoin(this.loadingOAuthConfigStore(), this.loadingOpenShiftToken(), () => true);
  }

  loadingOAuthConfigStore(): Observable<boolean> {
    return this.oAuthConfigStore.loading
      // Wait until loaded
      .skipWhile(loading => loading)
      // Take the first false as done
      .first();
  }

  loadingOpenShiftToken(): Observable<boolean> {
    return this.auth
      .getOpenShiftToken()
      .do (token => this.login.openShiftToken = token)
      .map(() => true)
      .first();
  }

}
