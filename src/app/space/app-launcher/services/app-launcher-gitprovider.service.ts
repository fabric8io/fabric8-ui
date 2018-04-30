import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { AuthHelperService, GitHubDetails, GitProviderService } from 'ngx-forge';

import { GitHubService } from 'app/space/create/codebases/services/github.service';

@Injectable()
export class AppLauncherGitproviderService implements GitProviderService {

  constructor(private gitService: GitHubService) {}

  /**
   * Connect GitHub account
   *
   * @param {string} redirectUrl The GitHub redirect URL
   */
  connectGitHubAccount(redirectUrl: string): void {
  }

  /**
   * Get GitHub repos associated with given user name
   *
   * @returns {Observable<any>}
   */
  private getGitHubUserData(): Observable<any> {
    return this.gitService.getUser();
  }


   /**
   * Get GitHub Organizations associated with given user name
   *
   * @param userName The GitHub user name
   * @returns {Observable<any>}
   */
  getUserOrgs(userName: string): Observable<any> {
    return this.gitService.getUserOrgs(userName);
  }


  /**
   * Returns GitHub details associated with the logged in user
   *
   * @returns {Observable<GitHubDetails>} The GitHub details associated with the logged in user
   */
  getGitHubDetails(): Observable<GitHubDetails> {
    return this.getGitHubUserData().flatMap(user => {
      if (user && user.login) {
        return this.getUserOrgs(user.login).flatMap(orgsArr => {
          if (orgsArr && orgsArr.length >= 0) {
            let orgs = orgsArr.slice(0);
            orgs.push(user.login);
            let gitHubDetails = {
              authenticated: true,
              avatar: user.avatar_url,
              login: user.login,
              organizations: orgs,
              organization: user.login
            } as GitHubDetails;
            return Observable.of(gitHubDetails);
          } else {
            return Observable.empty();
          }
        });
      } else {
        return Observable.empty();
      }
    });
  }

  /**
   * Returns true if GitHub repo exists
   *
   * @param {string} org The GitHub org (e.g., fabric8-launcher/ngx-launcher)
   * @param {string} repoName The GitHub repos name (e.g., ngx-launcher)
   * @returns {Observable<boolean>} True if GitHub repo exists
   */
  isGitHubRepo(org: string, repoName: string): Observable<boolean> {
    let fullName = org + '/' + repoName;
    return this.gitService.getRepoDetailsByFullName(fullName).map(repo => true);
  }

  /**
   * Returns list 0f GitHub repos
   *
   * @param {string} org The GitHub org (e.g., fabric8-launcher/ngx-launcher)
   * @returns {Observable<any>} list of existing GitHub repos
   */
  getGitHubRepoList(org: string): Observable<any> {
    return this.gitService.getUserRepos(org).map(repos => {
      let repoList = [];
      repos.forEach(function(repo) {
        repoList.push(repo.name);
      });
      return repoList;
    });
  }
}
