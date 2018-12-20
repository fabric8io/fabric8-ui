import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { WIT_API_URL } from 'ngx-fabric8-wit';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class LoginService {
  // private githubUrl = 'app/loginStatus';
  private githubUrl: string; // URL to web api

  constructor(private http: Http, @Inject(WIT_API_URL) private baseApiUrl: string) {
    this.githubUrl = this.baseApiUrl + 'login/authorize ';
  }

  gitHubSignIn() {
    window.location.href = this.githubUrl;
  }
}
