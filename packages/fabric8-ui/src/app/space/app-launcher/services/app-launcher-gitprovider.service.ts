import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { GitHubDetails, GitProviderService, HelperService, BuildTool } from 'ngx-launcher';
import { AuthenticationService } from 'ngx-login-client';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap, retry } from 'rxjs/operators';

import { cloneDeep } from 'lodash';
import { ProviderService } from '../../../shared/account/provider.service';
import { FABRIC8_BUILD_TOOL_DETECTOR_API_URL } from '../../../shared/runtime-console/fabric8-ui-build-tool-detector-api';

@Injectable()
export class AppLauncherGitproviderService implements GitProviderService {
  private END_POINT: string = '';

  private API_BASE: string = 'services/git/';

  private PROVIDER: string = 'GitHub';

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-App': 'osio',
    'x-git-provider': this.PROVIDER,
  });

  private gitHubUserLogin: string;

  private repositories: object = {};

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private helperService: HelperService,
    private providerService: ProviderService,
    @Inject(FABRIC8_BUILD_TOOL_DETECTOR_API_URL) private detectorApiUrl: string,
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
    const url = `${this.END_POINT + this.API_BASE}user`;
    return this.http.get(url, { headers: this.headers }).pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => throwError(error)),
    );
  }

  /**
   * Get GitHub Organizations associated with given user name
   *
   * @param userName The GitHub user name
   * @returns {Observable<any>}
   */
  getUserOrgs(userName: string): Observable<any> {
    const url = `${this.END_POINT + this.API_BASE}organizations`;
    return this.http
      .get(url, { headers: this.headers })
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }

  /**
   * Returns GitHub details associated with the logged in user
   *
   * @returns {Observable<GitHubDetails>} The GitHub details associated with the logged in user
   */
  getGitHubDetails(): Observable<GitHubDetails> {
    return this.getGitHubUserData().pipe(
      mergeMap((user) => {
        if (user && user.login) {
          this.gitHubUserLogin = user.login;
          const orgs: { [name: string]: string } = {};
          if (user.organizations && user.organizations.length >= 0) {
            this.repositories[''] = AppLauncherGitproviderService.removeOrganizationPrefix(
              user.repositories,
            );
            for (let i = 0; i < user.organizations.length; i++) {
              orgs[user.organizations[i]] = user.organizations[i];
            }
            orgs[user.login] = undefined;
            const gitHubDetails = {
              authenticated: true,
              avatar: user.avatarUrl,
              login: user.login,
              organizations: orgs,
              repositoryList: this.repositories[''],
            } as GitHubDetails;
            return of(gitHubDetails);
          }
        }
        return EMPTY;
      }),
    );
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
      map((repositories) => repositories.indexOf(fullName) !== -1),
    );
  }

  /**
   * Returns list 0f GitHub repos
   *
   * @param {string} org The GitHub org (e.g., fabric8-launcher/ngx-launcher)
   * @returns {Observable<any>} list of existing GitHub repos
   */
  getGitHubRepoList(org: string): Observable<any> {
    return this.getRepositories(org).pipe(
      map(AppLauncherGitproviderService.removeOrganizationPrefix),
    );
  }

  getDetectedBuildRuntime(repoUrl: string): Observable<BuildTool> {
    let headers = cloneDeep(this.headers);
    headers = headers.delete('X-App');
    headers = headers.delete('x-git-provider');
    const url = this.constructApiUrl(this.detectorApiUrl, `api/detect/build/${repoUrl}`);
    return this.http
      .get<BuildTool>(url, { headers })
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }

  /**
   * construct the API url for the services
   * @param apiUrl: string  API url
   * @param endPoint: string endpoint of the api Url
   */
  constructApiUrl(apiUrl: string, endPoint: string): string {
    let url = `${apiUrl}/${endPoint}`;
    if (apiUrl[apiUrl.length - 1] === '/') {
      url = apiUrl + endPoint;
    }
    return url;
  }

  private getRepositories(org: string = ''): Observable<string[]> {
    let o = org;
    if (o === this.gitHubUserLogin) {
      o = '';
    }
    if (this.repositories[o]) {
      return of(this.repositories[o]);
    }
    return this.http.get<string[]>(this.createUrl(o), { headers: this.headers }).pipe(
      map((json) => (json ? (json as string[]) : [])),
      tap((repositories) => (this.repositories[o] = repositories)),
      catchError((error: HttpErrorResponse) => throwError(error)),
    );
  }

  // Private
  private static removeOrganizationPrefix(repositories: string[]): string[] {
    return repositories.map((ele) => ele.replace(new RegExp('^[^/]+/'), ''));
  }

  private createUrl(org: string): string {
    const url = `${this.END_POINT + this.API_BASE}repositories`;
    return `${url}?organization=${org}`;
  }
}
