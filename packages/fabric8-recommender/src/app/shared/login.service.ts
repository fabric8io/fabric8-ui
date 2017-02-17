import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { LoginItem } from './login-item';

@Injectable()
export class LoginService {

  private REDIRECT_URL_KEY = 'redirectUrl';

  private githubUrl: string;  // URL to web api

  constructor(
    private http: Http,
    private router: Router,
    private localStorage: LocalStorageService
  ) {
    this.githubUrl = process.env.API_URL;
    if (this.githubUrl.substr(this.githubUrl.length - 1, 1) !== '/') {
      this.githubUrl += '/';
    }
    this.githubUrl += 'login/authorize ';
  }

  gitHubSignIn() {
    window.location.href = this.githubUrl;
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
