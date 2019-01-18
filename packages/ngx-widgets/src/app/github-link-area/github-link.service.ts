import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * This is the Type used for the data returned from Github
 */
export interface GitHubIssue {
  match: string;
  org: string;
  repo: string;
  issue: string;
  state?: string;
  url?: string;
}

/**
 * This provides a very simple retrieval of issue information from
 * GitHub. It uses the non-authorized public API of GitHub, so it
 * is rate-limited (to 60 requests/hr currently). To avoid as much
 * requests as possible, the request responses are cached here.
 */
@Injectable()
export class GitHubLinkService {
  private linkCache: GitHubIssue[] = [];

  constructor(private http: HttpClient) {}

  /*
   * This retrieves GitHub JSON information for a given remote GH issue. The given
   * linkData needs to contain 'org', 'repo' and 'issue' that refers to a GitHub issue.
   * The returned data is cached with infinite holding time, effectively only querying
   * once for every GitHub issue for the entire runtime of the service. This is needed
   * because GitHub is enforcing a strict rate limiting.
   */
  getIssue(linkData: GitHubIssue): Observable<GitHubIssue> {
    const cachedData = this.findInCache(linkData);
    if (cachedData) {
      return of(cachedData);
    }
    const query: Observable<GitHubIssue> = this.http
      .get<GitHubIssue>(
        `https://api.github.com/repos/${linkData.org}/${linkData.repo}/issues/${linkData.issue}`,
      )
      .pipe(
        catchError((error: any) => {
          linkData.state = 'error';
          return of(linkData);
        }),
      );
    query.subscribe((data) => {
      this.linkCache.push(data);
    });
    return query;
  }

  private findInCache(linkData: GitHubIssue): any {
    for (let i = 0; i < this.linkCache.length; i++) {
      const link = this.linkCache[i];
      if (
        link.url ===
        `https://api.github.com/repos/${linkData.org}/${linkData.repo}/issues/${linkData.issue}`
      ) {
        linkData.state = link.state;
        return linkData;
      }
    }
    return null;
  }
}
