import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Logger } from 'ngx-base';
import { Observable } from 'rxjs';

import { Context, Contexts } from 'ngx-fabric8-wit';
import {
  GitHubRepo,
  GitHubRepoCommit,
  GitHubRepoDetails,
  GitHubRepoLastCommit,
  GitHubRepoLicense
} from './github';

import * as _ from 'lodash';

/**
 * Service to pull details from GitHub
 *
 * See: https://developer.github.com/v3/
 */
@Injectable()
export class GitHubService {
  private cache: Map<string, Observable<any>>;
  private context: Context;
  private gitHubUrl: string;
  private headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json'
  });

  constructor(
      private contexts: Contexts,
      private http: Http,
      private logger: Logger,
      private auth: AuthenticationService,
      private userService: UserService) {
    this.contexts.current.subscribe(val => this.context = val);
    this.gitHubUrl = 'https://api.github.com';
    this.cache = new Map();

    // Todo: Use GitHub token?
    //if (this.auth.getToken() != null) {
    //  this.gitHubUrl += '/?access_token=' + this.auth.getToken();
    //}
  }

  /**
   * GitHub responses are cached due to rate limiting.
   *
   * For requests using Basic Authentication or OAuth, you can make up to 5,000 requests per hour. For
   * unauthenticated requests, the rate limit allows you to make up to 60 requests per hour.
   */
  clearCache(): void {
    this.cache = new Map();
  }

  /**
   * Get GitHub repo status for given URL and commit
   *
   * @param cloneUrl The GitHub URL (e.g., https://github.com/almighty/almighty-core.git)
   * @param sha The commit number to retrieve status for
   * @returns {Observable<GitHubRepoDetails>}
   */
  getRepoCommitStatusByUrl(cloneUrl: string, sha: string): Observable<GitHubRepoCommit> {
    let fullName = this.getFullName(cloneUrl);
    let url = `${this.gitHubUrl}/repos/${fullName}/commits/${sha}`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      let newHeaders = this.getHeaders(this.getUserName(fullName));
      let res = this.http
        .get(url, { headers: newHeaders })
        .map(response => {
          return response.json() as GitHubRepoCommit;
        })
        .publishReplay(1)
        .refCount()
        .catch((error) => {
          return this.handleError(error);
        });
      this.cache.set(url, res);
      return res;
    }
  }

  /**
   * Get GitHub repo details for given full name
   *
   * @param fullName The GitHub full name (e.g., almighty/almighty-core)
   * @returns {Observable<GitHubRepoDetails>}
   */
  getRepoDetailsByFullName(fullName: string): Observable<GitHubRepoDetails> {
    let url = `${this.gitHubUrl}/repos/${fullName}`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      let newHeaders = this.getHeaders(this.getUserName(fullName));
      let res = this.http
        .get(url, { headers: newHeaders })
        .map(response => {
          return response.json() as GitHubRepoDetails;
        })
        .publishReplay(1)
        .refCount()
        .catch((error) => {
          return this.handleError(error);
        });
      this.cache.set(url, res);
      return res;
    }
  }

  /**
   * Get GitHub repo details for given URL
   *
   * @param cloneUrl The GitHub URL (e.g., https://github.com/almighty/almighty-core.git)
   * @returns {Observable<GitHubRepoDetails>}
   */
  getRepoDetailsByUrl(cloneUrl: string): Observable<GitHubRepoDetails> {
    let fullName = this.getFullName(cloneUrl);
    return this.getRepoDetailsByFullName(fullName);
  }

  /**
   * Get GitHub repo last commit for given URL
   *
   * @param cloneUrl The GitHub URL (e.g., https://github.com/almighty/almighty-core.git)
   * @returns {Observable<GitHubRepoDetails>}
   */
  getRepoLastCommitByUrl(cloneUrl: string): Observable<GitHubRepoLastCommit> {
    let fullName = this.getFullName(cloneUrl);
    let url = `${this.gitHubUrl}/repos/${fullName}/git/refs/heads/master`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      let newHeaders = this.getHeaders(this.getUserName(fullName));
      let res = this.http
        .get(url, { headers: newHeaders })
        .map(response => {
          return response.json() as GitHubRepoLastCommit;
        })
        .publishReplay(1)
        .refCount()
        .catch((error) => {
          return this.handleError(error);
        });
      this.cache.set(url, res);
      return res;
    }
  }

  /**
   * Get GitHub repo license for given full name
   *
   * @param @param fullName The GitHub full name (e.g., almighty/almighty-core)
   * @returns {Observable<GitHubRepoDetails>}
   */
  getRepoLicenseByName(fullName: string): Observable<GitHubRepoLicense> {
    let url = `${this.gitHubUrl}/repos/${fullName}/license`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      let newHeaders = this.getHeaders(this.getUserName(fullName));
      let res = this.http
        .get(url, { headers: newHeaders })
        .map(response => {
          return response.json() as GitHubRepoLicense;
        })
        .publishReplay(1)
        .refCount()
        .catch((error) => {
          return this.handleError(error);
        });
      this.cache.set(url, res);
      return res;
    }
  }

  /**
   * Get GitHub repo license for given URL
   *
   * @param cloneUrl The GitHub URL (e.g., https://github.com/almighty/almighty-core.git)
   * @returns {Observable<GitHubRepoDetails>}
   */
  getRepoLicenseByUrl(cloneUrl: string): Observable<GitHubRepoLicense> {
    let fullName = this.getFullName(cloneUrl);
    return this.getRepoLicenseByName(fullName);
  }

  /**
   * Get GitHub repos associated with given user name
   *
   * @param userName The GitHub user name
   * @returns {Observable<GitHubRepo>}
   */
  getUserRepos(userName: string): Observable<GitHubRepo[]> {
    let url = `${this.gitHubUrl}/users/${userName}/repos`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      let newHeaders = this.getHeaders(userName);
      let res = this.http
        .get(url, { headers: newHeaders })
        .map(response => {
          return response.json() as GitHubRepo[]
        })
        .publishReplay(1)
        .refCount()
        .catch((error) => {
          return this.handleError(error);
        });
      this.cache.set(url, res);
      return res;
    }
  }

  // Private

  /**
   * Get GiHub headers for given user name
   *
   * @param userName
   * @returns {Headers}
   */
  private getHeaders(userName: string) {
    let newHeaders = _.cloneDeep(this.headers);
    newHeaders['User-Agent'] = userName;
    return newHeaders;
  }

  /**
   * Get GitHub full name from clone URL
   *
   * @param cloneUrl The GitHub clone URL (e.g., https://github.com/almighty/almighty-core.git)
   * @returns {string} The GitHub full name (e.g., almighty/almighty-core)
   */
  private getFullName(cloneUrl: string): string {
    let prefix = "https://github.com/";
    let start = cloneUrl.indexOf(prefix);
    let end = cloneUrl.indexOf(".git");
    return (start !== -1 && end !== -1) ? cloneUrl.substring(prefix.length, end) : cloneUrl;
  }

  /**
   * Get GitHub user name from repo full name
   *
   * @param fullName The GitHub repo full name (e.g., almighty/almighty-core)
   * @returns {string}
   */
  private getUserName(fullName: string): string {
    let index = fullName.indexOf("/");
    return (index !== -1) ? fullName.substring(0, index) : fullName;
  }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }
}
