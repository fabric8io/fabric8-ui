import { WIT_API_URL } from 'ngx-fabric8-wit';

import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { LoginItem } from './login-item';

@Injectable()
export class LoginService {

  private REDIRECT_URL_KEY = 'redirectUrl';

  private authUrl: string;  // URL to web api

  constructor(
    private http: Http,
    private router: Router,
    private localStorage: LocalStorageService,
    @Inject(WIT_API_URL) apiUrl: string
  ) {
    this.authUrl = apiUrl + 'login/authorize';
    console.log(this.authUrl);
  }

  gitHubSignIn() {
    window.location.href = this.authUrl;
  }

  public redirectAfterLogin() {
    let redirectUrl = this.localStorage.get<string>(this.REDIRECT_URL_KEY);
    if (redirectUrl) {
      this.router.navigate([redirectUrl]);
      this.localStorage.remove(this.REDIRECT_URL_KEY);
    } else {
      this.router.navigate(['home']);
    }
  }

  public set redirectUrl(value: string) {
    this.localStorage.set(this.REDIRECT_URL_KEY, value);
  }

}
