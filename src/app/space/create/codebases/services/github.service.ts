import { Injectable, OnDestroy } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';
import { Logger } from 'ngx-base';
import { Observable, Subscription } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { cloneDeep } from 'lodash';

import { Context, Contexts } from 'ngx-fabric8-wit';
import {
  GitHubRepo,
  GitHubRepoBranch,
  GitHubRepoCommit,
  GitHubRepoComparison,
  GitHubRepoDetails,
  GitHubRepoLastCommit,
  GitHubRepoLicense,
  GitHubUser
} from './github';

/**
 * Service to pull details from GitHub
 *
 * See: https://developer.github.com/v3/
 */
@Injectable()
export class GitHubService implements OnDestroy {

  private static readonly HEADERS = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json'
  });

  private cache: Map<string, Observable<any>>;
  private context: Context;
  private gitHubUrl: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthenticationService,
      private contexts: Contexts,
      private http: Http,
      private logger: Logger) {
    this.subscriptions.push(this.contexts.current.subscribe(val => this.context = val));
    this.gitHubUrl = 'https://api.github.com';
    this.cache = new Map();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
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
   * GitHub responses are cached due to rate limiting.
   *
   * Note: This was made public for the unit tests
   *
   * @param url
   * @returns {undefined|Observable<any>}
   */
  getCache(url: string): Observable<any>{
    return this.cache.get(url);
  }

  /**
   * Get GitHub headers for authentified user
   *
   * Note: This was made public for the unit tests
   *
   * @returns {Headers}
   */
  getHeaders(): Observable<Headers> {
    return this.authService.gitHubToken.map(token => {
      let newHeaders = cloneDeep(GitHubService.HEADERS);
      newHeaders.set('Authorization', `token ${token}`);
      return newHeaders;
    });
  }

  /**
   * Get GitHub repo status for given URL and commit
   *
   * @param cloneUrl The GitHub URL (e.g., https://github.com/fabric8-services/fabric8-wit.git)
   * @param sha The commit number to retrieve status for
   * @returns {Observable<GitHubRepoDetails>}
   */
  getRepoCommitStatusByUrl(cloneUrl: string, sha: string): Observable<GitHubRepoCommit> {
    let fullName = this.getFullName(cloneUrl);
    let url = `${this.gitHubUrl}/repos/${fullName}/commits/${sha}`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      let res = this.getHeaders()
        .switchMap(newHeaders => this.http
          .get(url, { headers: newHeaders }))
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
   * @param fullName The GitHub full name (e.g., fabric8-services/fabric8-wit)
   * @returns {Observable<GitHubRepoDetails>}
   */
  getRepoDetailsByFullName(fullName: string): Observable<GitHubRepoDetails> {
    let url = `${this.gitHubUrl}/repos/${fullName}`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      let res = this.getHeaders()
        .switchMap(newHeaders => this.http
          .get(url, { headers: newHeaders }))
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
   * @param cloneUrl The GitHub URL (e.g., https://github.com/fabric8-services/fabric8-wit.git)
   * @returns {Observable<GitHubRepoDetails>}
   */
  getRepoDetailsByUrl(cloneUrl: string): Observable<GitHubRepoDetails> {
    let fullName = this.getFullName(cloneUrl);
    return this.getRepoDetailsByFullName(fullName);
  }

  /**
   * todo
   *
   * @param {string} fullName the repo full name
   * @param {string} base the first branch name
   * @param {string} head the second branch name
   * @returns {Observable<any>}
   */
  getRepoBranchesComparisonByFullName(fullName: string, base: string, head: string): Observable<GitHubRepoComparison> {
    const url = `${this.gitHubUrl}/repos/${fullName}/compare/${base}...${head}`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      const res = this.getHeaders()
        .switchMap(newHeaders => this.http
          .get(url, { headers: newHeaders }))
        .map(response => {
          return response.json() as GitHubRepoComparison;
        })
        .publishReplay(1)
        .refCount()
        .catch(error => {
          return this.handleError(error);
        });
      this.cache.set(url, res);
      return res;
    }
  }

  /**
   * todo
   *
   * @param {string} url
   * @param {string} base
   * @param {string} head
   * @returns {Observable<any>}
   */
  getRepoBranchesComparisonByUrl(url: string, base: string, head: string): Observable<GitHubRepoComparison> {
    const fullName = this.getFullName(url);
    return this.getRepoBranchesComparisonByFullName(fullName, base, head);
  }

  getRepoBranchesByFullName(fullName: string): Observable<GitHubRepoBranch[]> {
    const firstPageUrl = `${this.gitHubUrl}/repos/${fullName}/branches?page=1`;
    return this.getUrl(firstPageUrl)
      // get last page number
      .map(response => {
        const links = response.headers.get('link'),
          linkRE = /<[^>]+?page=(\d+)>;\srel="last"/;
        if (!links || !links.length || !linkRE.test(links)) {
          return 1;
        } else {
          const match = links.match(linkRE);
          const lastPageNum = parseInt(match[1], 10);
          return isNaN(lastPageNum) || lastPageNum < 1 ? 1 : lastPageNum;
        }
      })
      // build array of pages
      .flatMap(lastPageNum => Observable.range(1, lastPageNum))
      .scan((pageNums: number[], num: number) => {
        pageNums.push(num);
        return pageNums;
      }, [])
      // get all pages in parallel
      .flatMap(pageNums => {
        return Observable.forkJoin(
          pageNums.map(pageNum => {
            const pageUrl = `${this.gitHubUrl}/repos/${fullName}/branches?page=${pageNum}`;
            return this.getUrl(pageUrl);
          })
        );
      })
      // `last()` is necessary because `forkJoin` runs
      // as any one of the subjects is completed
      .last()
      .map(responses => {
        return responses.reduce((branchesAll: GitHubRepoBranch[], response: Response) => {
          const branchesOnPage = response.json() as GitHubRepoBranch[];
          return branchesAll.concat(branchesOnPage);
        }, []);
      });
  }

  timeoutObservable(sec: number): Observable<any> {
    return Observable.create((observer) => {
      console.log(`timeout for ${sec} seconds created`);
      setTimeout(() => {
        console.log(`timeout ${sec} seconds done.`);
        observer.next(`${sec} seconds timeout.`);
        observer.complete();
      }, 1000 * sec);
    });
  }

  getRepoBranchesByUrl(url: string): Observable<GitHubRepoBranch[]> {
    const fullName = this.getFullName(url);
    return this.getRepoBranchesByFullName(fullName);
  }

  /**
   * Get GitHub repo last commit for given URL
   *
   * @param cloneUrl The GitHub URL (e.g., https://github.com/fabric8-services/fabric8-wit.git)
   * @returns {Observable<GitHubRepoDetails>}
   */
  getRepoLastCommitByUrl(cloneUrl: string): Observable<GitHubRepoLastCommit> {
    let fullName = this.getFullName(cloneUrl);
    let url = `${this.gitHubUrl}/repos/${fullName}/git/refs/heads/master`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      let res = this.getHeaders()
        .switchMap(newHeaders => this.http
          .get(url, { headers: newHeaders }))
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
   * @param @param fullName The GitHub full name (e.g., fabric8-services/fabric8-wit)
   * @returns {Observable<GitHubRepoDetails>}
   */
  getRepoLicenseByName(fullName: string): Observable<GitHubRepoLicense> {
    let url = `${this.gitHubUrl}/repos/${fullName}/license`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      let res = this.getHeaders()
        .switchMap(newHeaders => this.http
          .get(url, { headers: newHeaders }))
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
   * @param cloneUrl The GitHub URL (e.g., https://github.com/fabric8-services/fabric8-wit.git)
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
      let res = this.getHeaders()
        .switchMap(newHeaders => this.http
          .get(url, { headers: newHeaders }))
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

  /**
   * Get authenticate GitHub user
   *
   * @returns {Observable<GitHubUser>}
   */
  getUser(): Observable<GitHubUser> {
    let url = `${this.gitHubUrl}/user`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      let res = this.getHeaders()
        .switchMap(newHeaders => this.http
          .get(url, { headers: newHeaders }))
        .map(response => {
          return response.json() as GitHubUser
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
   * Get GitHub full name from clone URL
   *
   * @param cloneUrl The GitHub clone URL (e.g., https://github.com/fabric8-services/fabric8-wit.git)
   * @returns {string} The GitHub full name (e.g., fabric8-services/fabric8-wit)
   */
  private getFullName(cloneUrl: string): string {
    let prefix = "https://github.com/";
    let start = cloneUrl.indexOf(prefix);
    let end = cloneUrl.indexOf(".git");
    return (start !== -1 && end !== -1) ? cloneUrl.substring(prefix.length, end) : cloneUrl;
  }

  private getUrl(url: string): Observable<Response> {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      const res = this.getHeaders()
        .switchMap(newHeaders => {
          return this.http.get(url, {headers: newHeaders});
        })
        .publishReplay(1)
        .refCount()
        .catch(error => {
          return this.handleError(error);
        });

      // in fact, response is not an `Observable` but `AnonymousSubject`
      // so we have to complete it manually
      (res as Subject<Response>).complete();

      this.cache.set(url, res);
      return res;
    }
  }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }

}
