import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GitHubDetails, GitProviderService, HelperService } from 'ngx-launcher';
import { AuthenticationService } from 'ngx-login-client';
import { empty as observableEmpty, Observable, of, of as observableOf, throwError as observableThrowError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { ProviderService } from '../../../shared/account/provider.service';

@Injectable()
export class AppLauncherGitproviderService implements GitProviderService {

  private END_POINT: string = '';
  private API_BASE: string = 'services/git/';
  private PROVIDER: string = 'GitHub';
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-App': 'osio',
    'x-git-provider': this.PROVIDER
  });

  private repositories: object = {};

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private helperService: HelperService,
    private providerService: ProviderService
  ) {
    if (this.helperService) {
      this.END_POINT = this.helperService.getBackendUrl();
    }
    if (this.auth.getToken() != null) {
      this.headers = this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
  }

  /**
   * Connect GitHub account
   *
   * @param {string} redirectUrl The GitHub redirect URL
   */
  connectGitHubAccount(redirectUrl: string): void {
    this.providerService.link('https://github.com', redirectUrl);
  }

  /**
   * Get GitHub repos associated with given user name
   *
   * @returns {Observable<any>}
   */
  private getGitHubUserData(): Observable<any> {
    let url = this.END_POINT + this.API_BASE + 'user';
    return this.http
      .get(url, { headers: this.headers }).pipe(
        catchError((error: HttpErrorResponse) => {
          return observableThrowError(error);
        }));
  }


  /**
  * Get GitHub Organizations associated with given user name
  *
  * @param userName The GitHub user name
  * @returns {Observable<any>}
  */
  getUserOrgs(userName: string): Observable<any> {
    let url = this.END_POINT + this.API_BASE + 'organizations';
    return this.http
      .get(url, { headers: this.headers }).pipe(
        catchError((error: HttpErrorResponse) => {
          return observableThrowError(error);
        }));
  }


  /**
   * Returns GitHub details associated with the logged in user
   *
   * @returns {Observable<GitHubDetails>} The GitHub details associated with the logged in user
   */
  getGitHubDetails(): Observable<GitHubDetails> {
    return this.getGitHubUserData().pipe(mergeMap(user => {
      if (user && user.login) {
        let orgs: { [name: string]: string } = {};
        return this.getUserOrgs(user.login).pipe(mergeMap(orgsArr => {
          if (orgsArr && orgsArr.length >= 0) {
            this.repositories[''] = AppLauncherGitproviderService.removeOrganizationPrefix(user.repositories);
            for (let i = 0; i < orgsArr.length; i++) {
              orgs[orgsArr[i]] = orgsArr[i];
            }
            orgs[user.login] = undefined;
            let gitHubDetails = {
              authenticated: true,
              avatar: user.avatarUrl,
              login: user.login,
              organizations: orgs
            } as GitHubDetails;
            return observableOf(gitHubDetails);
          } else {
            return observableEmpty();
          }
        }));
      } else {
        return observableEmpty();
      }
    }));
  }

  /**
   * Returns true if GitHub repo exists
   *
   * @param {string} org The GitHub org (e.g., fabric8-launcher/ngx-launcher)
   * @param {string} repoName The GitHub repos name (e.g., ngx-launcher)
   * @returns {Observable<boolean>} True if GitHub repo exists
   */
  isGitHubRepo(org: string, repoName: string): Observable<boolean> {
    const fullName = org ? `${org}/${repoName}` : repoName;
    return this.getRepositories(org).pipe(
      map((repositories) => {
        return repositories.indexOf(fullName) !== -1;
      })
    );
  }

  /**
   * Returns list 0f GitHub repos
   *
   * @param {string} org The GitHub org (e.g., fabric8-launcher/ngx-launcher)
   * @returns {Observable<any>} list of existing GitHub repos
   */
  getGitHubRepoList(org: string): Observable<any> {
    return this.getRepositories(org).pipe(map(AppLauncherGitproviderService.removeOrganizationPrefix));
  }

  private getRepositories(org: string = ''): Observable<string[]> {
    if (this.repositories[org]) {
      return of(this.repositories[org]);
    }
    return this.http.get(this.createUrl(org), { headers: this.headers }).pipe(
      map((json) => json ? json as string[] : []),
      map((repositories) => this.repositories[org] = repositories),
      catchError((error: HttpErrorResponse) => {
        return observableThrowError(error);
      }));
  }

  // Private
  private static removeOrganizationPrefix(repositories: string[]): string[] {
    return repositories.map((ele) => ele.replace(new RegExp('^[^/]+/'), ''));
  }

  private createUrl(org: string) {
    const url = Location.joinWithSlash(this.API_BASE, 'repositories');
    return `${url}?organization=${org}`;
  }
}
