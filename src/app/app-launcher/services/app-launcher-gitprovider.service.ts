import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import { GitProviderService } from 'ngx-forge';

import {
  GitHubRepo,
  GitHubRepoCommit,
  GitHubRepoDetails,
  GitHubRepoLastCommit,
  GitHubRepoLicense,
  GitHubUser
} from '../../space/create/codebases/services/github';

// Enable Access-Conrtol-Expose-Headers for CORS to test
@Injectable()
export class AppLauncherGitproviderService implements GitProviderService {
  private static readonly HEADERS = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json'
  });

  private clientId: string = 'a59372e52d3128f59dfb'; // Temp test app
  private clientSecret: string = 'd78cccc1a3310d06b7b7debe7e9f0df7bcda16a5'; // Temp test app
  private gitHubUrl: string = 'https://api.github.com';
  private token: string;

  constructor(private http: Http) {
  }

  authorize(redirectUrl: string): void {
    let url = 'https://github.com/login/oauth/authorize?client_id=' + this.clientId +
      '&redirect_uri=' + encodeURIComponent(redirectUrl);
    this.redirectToAuth(url);
  }

  /**
   * Get GitHub repo details for given full name
   *
   * @param fullName The GitHub full name (e.g., fabric8-services/fabric8-wit)
   * @returns {Observable<GitHubRepoDetails>}
   */
  getRepoDetailsByFullName(fullName: string): Observable<GitHubRepoDetails> {
    let url = `${this.gitHubUrl}/repos/${fullName}`;
    return this.getHeaders()
      .switchMap(newHeaders => this.http
        .get(url, { headers: newHeaders }))
      .map(response => {
        return response.json() as GitHubRepoDetails;
      });
  }

  /**
   * Get authenticate GitHub user
   *
   * @returns {Observable<GitHubUser>}
   */
  getUser(): Observable<GitHubUser> {
    let url = `${this.gitHubUrl}/user`;
    return this.getHeaders()
      .switchMap(newHeaders => this.http
        .get(url, { headers: newHeaders }))
      .map(response => {
        return response.json() as GitHubUser;
      });
  }

  /**
   * Get authentication token
   *
   * @returns {Observable<any>}
   */
  getToken(): Observable<any> {
    if (this.token !== undefined) {
      return Observable.of(this.token);
    }
    let code = this.getRequestParam('code');
    if (code === null) {
      return Observable.empty();
    }
    let url = 'https://github.com/login/oauth/access_token?' + 'client_id=' +
      this.clientId + '&client_secret=' + this.clientSecret + '&code=' + code;
    return this.http.get(url)
      .map((response) => {
        let body = response.text();
        let accessToken = this.getParamFromString('access_token', body);
        if (accessToken !== null) {
          this.token = accessToken;
        }
        return this.token;
      });
  }

  // Private

  // Get GitHub headers for authentified user
  private getHeaders(): Observable<any> {
    if (this.token !== undefined) {
      let newHeaders: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${this.token}`
      };
      return Observable.of(newHeaders);
    }
    return this.getToken().map(token => {
      let newHeaders: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`
      };
      return newHeaders;
    });
  }

  /**
   * Helper to retrieve request parameters
   *
   * @param name The request parameter to retrieve
   * @returns {any} The request parameter value or null
   */
  private getRequestParam(name: string): string {
    let param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(window.location.search);
    if (param !== null) {
      return decodeURIComponent(param[1]);
    }
    return null;
  }

  private getParamFromString(name: string, val: string): string {
    let param = (new RegExp(encodeURIComponent(name) + '=([^&]*)')).exec(val);
    if (param !== null) {
      return decodeURIComponent(param[1]);
    }
    return null;
  }

  private redirectToAuth(url: string) {
    console.log('DemoGitProviderService.redirectToAuth: ' + url);
    window.location.href = url;
  }
}
