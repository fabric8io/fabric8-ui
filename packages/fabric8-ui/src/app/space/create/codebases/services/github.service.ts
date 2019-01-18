import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from 'ngx-login-client';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map, publishReplay, refCount, switchMap } from 'rxjs/operators';
import {
  GitHubRepo,
  GitHubRepoCommit,
  GitHubRepoDetails,
  GitHubRepoLastCommit,
  GitHubRepoLicense,
  GitHubUser,
} from './github';

/**
 * Service to pull details from GitHub
 *
 * See: https://developer.github.com/v3/
 */
@Injectable()
export class GitHubService {
  private static readonly HEADERS: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github.v3+json',
  });

  private readonly cache: Map<string, Observable<any>>;
  private readonly gitHubUrl: string;

  constructor(private authService: AuthenticationService, private http: HttpClient) {
    this.gitHubUrl = 'https://api.github.com';
    this.cache = new Map();
  }

  /**
   * GitHub responses are cached due to rate limiting.
   *
   * For requests using Basic Authentication or OAuth, you can make up to 5,000 requests per hour. For
   * unauthenticated requests, the rate limit allows you to make up to 60 requests per hour.
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * GitHub responses are cached due to rate limiting.
   *
   * Note: This was made public for the unit tests
   *
   * @param url
   * @returns {undefined|Observable<any>}
   */
  getCache(url: string): Observable<any> {
    return this.cache.get(url);
  }

  /**
   * Get GitHub headers for authentified user
   *
   * Note: This was made public for the unit tests
   *
   * @returns {Headers}
   */
  getHeaders(): Observable<HttpHeaders> {
    return this.authService.gitHubToken.pipe(
      map(
        (token: string): HttpHeaders =>
          GitHubService.HEADERS.set('Authorization', `token ${token}`),
      ),
    );
  }

  /**
   * Get GitHub repo status for given URL and commit
   *
   * @param cloneUrl The GitHub URL (e.g., https://github.com/fabric8-services/fabric8-wit.git)
   * @param sha The commit number to retrieve status for
   * @returns {Observable<GitHubRepoDetails>}
   */
  getRepoCommitStatusByUrl(cloneUrl: string, sha: string): Observable<GitHubRepoCommit> {
    const fullName: string = this.getFullName(cloneUrl);
    const url: string = `${this.gitHubUrl}/repos/${fullName}/commits/${sha}`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      const res: Observable<GitHubRepoCommit> = this.getHeaders().pipe(
        switchMap(
          (headers: HttpHeaders): Observable<GitHubRepoCommit> =>
            this.http.get<GitHubRepoCommit>(url, { headers }),
        ),
        publishReplay(1),
        refCount(),
        catchError(
          (error: HttpErrorResponse): Observable<GitHubRepoCommit> => this.handleError(error),
        ),
      );
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
    const url: string = `${this.gitHubUrl}/repos/${fullName}`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      const res: Observable<GitHubRepoDetails> = this.getHeaders().pipe(
        switchMap(
          (headers: HttpHeaders): Observable<GitHubRepoDetails> =>
            this.http.get<GitHubRepoDetails>(url, { headers }),
        ),
        publishReplay(1),
        refCount(),
        catchError(
          (error: HttpErrorResponse): Observable<GitHubRepoDetails> => this.handleError(error),
        ),
      );
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
    const fullName: string = this.getFullName(cloneUrl);
    return this.getRepoDetailsByFullName(fullName);
  }

  /**
   * Get GitHub repo last commit for given URL
   *
   * @param cloneUrl The GitHub URL (e.g., https://github.com/fabric8-services/fabric8-wit.git)
   * @returns {Observable<GitHubRepoDetails>}
   */
  getRepoLastCommitByUrl(cloneUrl: string): Observable<GitHubRepoLastCommit> {
    const fullName: string = this.getFullName(cloneUrl);
    const url: string = `${this.gitHubUrl}/repos/${fullName}/git/refs/heads/master`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      const res: Observable<GitHubRepoLastCommit> = this.getHeaders().pipe(
        switchMap(
          (headers: HttpHeaders): Observable<GitHubRepoLastCommit> =>
            this.http.get<GitHubRepoLastCommit>(url, { headers }),
        ),
        publishReplay(1),
        refCount(),
        catchError(
          (error: HttpErrorResponse): Observable<GitHubRepoLastCommit> => this.handleError(error),
        ),
      );
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
    const url: string = `${this.gitHubUrl}/repos/${fullName}/license`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      const res: Observable<GitHubRepoLicense> = this.getHeaders().pipe(
        switchMap(
          (headers: HttpHeaders): Observable<GitHubRepoLicense> =>
            this.http.get<GitHubRepoLicense>(url, { headers }),
        ),
        publishReplay(1),
        refCount(),
        catchError(
          (error: HttpErrorResponse): Observable<GitHubRepoLicense> => this.handleError(error),
        ),
      );
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
    const fullName: string = this.getFullName(cloneUrl);
    return this.getRepoLicenseByName(fullName);
  }

  /**
   * Get GitHub repos associated with given user name
   *
   * @param userName The GitHub user name
   * @returns {Observable<GitHubRepo>}
   */
  getUserRepos(userName: string): Observable<GitHubRepo[]> {
    const url: string = `${this.gitHubUrl}/users/${userName}/repos`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      const res: Observable<GitHubRepo[]> = this.getHeaders().pipe(
        switchMap(
          (headers: HttpHeaders): Observable<GitHubRepo[]> =>
            this.http.get<GitHubRepo[]>(url, { headers }),
        ),
        publishReplay(1),
        refCount(),
        catchError((error: HttpErrorResponse): Observable<GitHubRepo[]> => this.handleError(error)),
      );
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
    const url: string = `${this.gitHubUrl}/user`;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    } else {
      const res: Observable<GitHubUser> = this.getHeaders().pipe(
        switchMap(
          (headers: HttpHeaders): Observable<GitHubUser> =>
            this.http.get<GitHubUser>(url, { headers }),
        ),
        publishReplay(1),
        refCount(),
        catchError((error: HttpErrorResponse): Observable<GitHubUser> => this.handleError(error)),
      );
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
    const prefix: string = 'https://github.com/';
    const start: number = cloneUrl.indexOf(prefix);
    const end: number = cloneUrl.indexOf('.git');
    return start !== -1 && end !== -1 ? cloneUrl.substring(prefix.length, end) : cloneUrl;
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    return observableThrowError(error.message || error);
  }
}
