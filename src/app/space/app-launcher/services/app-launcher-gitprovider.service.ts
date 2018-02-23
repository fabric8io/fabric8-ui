import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GitHubDetails, GitProviderService } from 'ngx-forge';

@Injectable()
export class AppLauncherGitproviderService implements GitProviderService {
  constructor() {
  }

  /**
   * Connect GitHub account
   *
   * @param {string} redirectUrl The GitHub redirect URL
   */
  connectGitHubAccount(redirectUrl: string): void {
    // let url = "https://github.com/login/oauth/authorize?client_id=" + this.clientId +
    //  "&redirect_uri=" + encodeURIComponent(redirectUrl);
    this.redirectToAuth(redirectUrl);
  }

  /**
   * Returns GitHub details associated with the logged in user
   *
   * @returns {Observable<GitHubDetails>} The GitHub details associated with the logged in user
   */
  getGitHubDetails(): Observable<GitHubDetails> {
    let orgs = [];
    for (let i = 0; i < GitHubMock.ORGS.length; i++) {
      orgs.push(GitHubMock.ORGS[i].login);
    }
    let gitHubDetails = {
      authenticated: this.isPageRedirect() ? true : false,
      avatar: GitHubMock.USER.avatar_url,
      login: GitHubMock.USER.login,
      organizations: orgs
    } as GitHubDetails;
    return this.isPageRedirect() ? Observable.of(gitHubDetails) : Observable.empty();
  }

  /**
   * Returns true if GitHub repo exists
   *
   * @param {string} fullName The GitHub full name (e.g., fabric8-launcher/ngx-launcher)
   * @returns {Observable<boolean>} True if GitHub repo exists
   */
  isGitHubRepo(fullName: string): Observable<boolean> {
    let result = (fullName === 'patternfly/patternfly'); // Simulate a existing repo
    return Observable.of(result);
  }

  // Private

  private isPageRedirect(): boolean {
    let result = this.getRequestParam('selection'); // simulate Github auth redirect
    return (result !== null);
  }

  private getRequestParam(name: string): string {
    let param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(window.location.search);
    if (param !== null) {
      return decodeURIComponent(param[1]);
    }
    return null;
  }

  private redirectToAuth(url: string) {
    window.location.href = url;
  }
}

// Mock GitHub data
export class GitHubMock {
  static readonly USER = {
    'login': 'testuser',
    'id': 17882357,
    'avatar_url': 'https://avatars3.githubusercontent.com/u/17882357?v=4',
    'gravatar_id': '',
    'url': 'https://api.github.com/users/testuser',
    'html_url': 'https://github.com/testuser',
    'followers_url': 'https://api.github.com/users/testuser/followers',
    'following_url': 'https://api.github.com/users/testuser/following{/other_user}',
    'gists_url': 'https://api.github.com/users/testuser/gists{/gist_id}',
    'starred_url': 'https://api.github.com/users/testuser/starred{/owner}{/repo}',
    'subscriptions_url': 'https://api.github.com/users/testuser/subscriptions',
    'organizations_url': 'https://api.github.com/users/testuser/orgs',
    'repos_url': 'https://api.github.com/users/testuser/repos',
    'events_url': 'https://api.github.com/users/testuser/events{/privacy}',
    'received_events_url': 'https://api.github.com/users/testuser/received_events',
    'type': 'User',
    'site_admin': false,
    'name': 'First Last',
    'company': null,
    'blog': '',
    'location': null,
    'email': null,
    'hireable': null,
    'bio': null,
    'public_repos': 5,
    'public_gists': 0,
    'followers': 0,
    'following': 0,
    'created_at': '2016-03-16T14:57:23Z',
    'updated_at': '2017-08-29T05:15:51Z'
  } as any;

  static readonly ORGS = [{
    'login': 'patternfly',
    'id': 6391110,
    'url': 'https://api.github.com/orgs/patternfly',
    'repos_url': 'https://api.github.com/orgs/patternfly/repos',
    'events_url': 'https://api.github.com/orgs/patternfly/events',
    'hooks_url': 'https://api.github.com/orgs/patternfly/hooks',
    'issues_url': 'https://api.github.com/orgs/patternfly/issues',
    'members_url': 'https://api.github.com/orgs/patternfly/members{/member}',
    'public_members_url': 'https://api.github.com/orgs/patternfly/public_members{/member}',
    'avatar_url': 'https://avatars3.githubusercontent.com/u/6391110?v=4',
    'description': 'Created to promote design commonality and improved user experience across enterprise IT...'
  }, {
    'login': 'patternfly-webcomponents',
    'id': 23172391,
    'url': 'https://api.github.com/orgs/patternfly-webcomponents',
    'repos_url': 'https://api.github.com/orgs/patternfly-webcomponents/repos',
    'events_url': 'https://api.github.com/orgs/patternfly-webcomponents/events',
    'hooks_url': 'https://api.github.com/orgs/patternfly-webcomponents/hooks',
    'issues_url': 'https://api.github.com/orgs/patternfly-webcomponents/issues',
    'members_url': 'https://api.github.com/orgs/patternfly-webcomponents/members{/member}',
    'public_members_url': 'https://api.github.com/orgs/patternfly-webcomponents/public_members{/member}',
    'avatar_url': 'https://avatars1.githubusercontent.com/u/23172391?v=4',
    'description': ''
  }, {
    'login': 'redhat-rcue',
    'id': 24577446,
    'url': 'https://api.github.com/orgs/redhat-rcue',
    'repos_url': 'https://api.github.com/orgs/redhat-rcue/repos',
    'events_url': 'https://api.github.com/orgs/redhat-rcue/events',
    'hooks_url': 'https://api.github.com/orgs/redhat-rcue/hooks',
    'issues_url': 'https://api.github.com/orgs/redhat-rcue/issues',
    'members_url': 'https://api.github.com/orgs/redhat-rcue/members{/member}',
    'public_members_url': 'https://api.github.com/orgs/redhat-rcue/public_members{/member}',
    'avatar_url': 'https://avatars0.githubusercontent.com/u/24577446?v=4',
    'description': null
  }] as any[];

  static readonly PATTERNFLY = {
    'id': 16493298,
    'name': 'patternfly',
    'full_name': 'patternfly/patternfly',
    'owner': {
      'login': 'patternfly',
      'id': 6391110,
      'avatar_url': 'https://avatars3.githubusercontent.com/u/6391110?v=4',
      'gravatar_id': '',
      'url': 'https://api.github.com/users/patternfly',
      'html_url': 'https://github.com/patternfly',
      'followers_url': 'https://api.github.com/users/patternfly/followers',
      'following_url': 'https://api.github.com/users/patternfly/following{/other_user}',
      'gists_url': 'https://api.github.com/users/patternfly/gists{/gist_id}',
      'starred_url': 'https://api.github.com/users/patternfly/starred{/owner}{/repo}',
      'subscriptions_url': 'https://api.github.com/users/patternfly/subscriptions',
      'organizations_url': 'https://api.github.com/users/patternfly/orgs',
      'repos_url': 'https://api.github.com/users/patternfly/repos',
      'events_url': 'https://api.github.com/users/patternfly/events{/privacy}',
      'received_events_url': 'https://api.github.com/users/patternfly/received_events',
      'type': 'Organization',
      'site_admin': false
    },
    'private': false,
    'html_url': 'https://github.com/patternfly/patternfly',
    'description': 'PatternFly open interface project',
    'fork': false,
    'url': 'https://api.github.com/repos/patternfly/patternfly',
    'forks_url': 'https://api.github.com/repos/patternfly/patternfly/forks',
    'keys_url': 'https://api.github.com/repos/patternfly/patternfly/keys{/key_id}',
    'collaborators_url': 'https://api.github.com/repos/patternfly/patternfly/collaborators{/collaborator}',
    'teams_url': 'https://api.github.com/repos/patternfly/patternfly/teams',
    'hooks_url': 'https://api.github.com/repos/patternfly/patternfly/hooks',
    'issue_events_url': 'https://api.github.com/repos/patternfly/patternfly/issues/events{/number}',
    'events_url': 'https://api.github.com/repos/patternfly/patternfly/events',
    'assignees_url': 'https://api.github.com/repos/patternfly/patternfly/assignees{/user}',
    'branches_url': 'https://api.github.com/repos/patternfly/patternfly/branches{/branch}',
    'tags_url': 'https://api.github.com/repos/patternfly/patternfly/tags',
    'blobs_url': 'https://api.github.com/repos/patternfly/patternfly/git/blobs{/sha}',
    'git_tags_url': 'https://api.github.com/repos/patternfly/patternfly/git/tags{/sha}',
    'git_refs_url': 'https://api.github.com/repos/patternfly/patternfly/git/refs{/sha}',
    'trees_url': 'https://api.github.com/repos/patternfly/patternfly/git/trees{/sha}',
    'statuses_url': 'https://api.github.com/repos/patternfly/patternfly/statuses/{sha}',
    'languages_url': 'https://api.github.com/repos/patternfly/patternfly/languages',
    'stargazers_url': 'https://api.github.com/repos/patternfly/patternfly/stargazers',
    'contributors_url': 'https://api.github.com/repos/patternfly/patternfly/contributors',
    'subscribers_url': 'https://api.github.com/repos/patternfly/patternfly/subscribers',
    'subscription_url': 'https://api.github.com/repos/patternfly/patternfly/subscription',
    'commits_url': 'https://api.github.com/repos/patternfly/patternfly/commits{/sha}',
    'git_commits_url': 'https://api.github.com/repos/patternfly/patternfly/git/commits{/sha}',
    'comments_url': 'https://api.github.com/repos/patternfly/patternfly/comments{/number}',
    'issue_comment_url': 'https://api.github.com/repos/patternfly/patternfly/issues/comments{/number}',
    'contents_url': 'https://api.github.com/repos/patternfly/patternfly/contents/{+path}',
    'compare_url': 'https://api.github.com/repos/patternfly/patternfly/compare/{base}...{head}',
    'merges_url': 'https://api.github.com/repos/patternfly/patternfly/merges',
    'archive_url': 'https://api.github.com/repos/patternfly/patternfly/{archive_format}{/ref}',
    'downloads_url': 'https://api.github.com/repos/patternfly/patternfly/downloads',
    'issues_url': 'https://api.github.com/repos/patternfly/patternfly/issues{/number}',
    'pulls_url': 'https://api.github.com/repos/patternfly/patternfly/pulls{/number}',
    'milestones_url': 'https://api.github.com/repos/patternfly/patternfly/milestones{/number}',
    'notifications_url': 'https://api.github.com/repos/patternfly/patternfly/notifications{?since,all,participating}',
    'labels_url': 'https://api.github.com/repos/patternfly/patternfly/labels{/name}',
    'releases_url': 'https://api.github.com/repos/patternfly/patternfly/releases{/id}',
    'deployments_url': 'https://api.github.com/repos/patternfly/patternfly/deployments',
    'created_at': '2014-02-03T21:18:00Z',
    'updated_at': '2018-02-08T16:04:54Z',
    'pushed_at': '2018-02-08T16:08:59Z',
    'git_url': 'git://github.com/patternfly/patternfly.git',
    'ssh_url': 'git@github.com:patternfly/patternfly.git',
    'clone_url': 'https://github.com/patternfly/patternfly.git',
    'svn_url': 'https://github.com/patternfly/patternfly',
    'homepage': 'https://www.patternfly.org/',
    'size': 81561,
    'stargazers_count': 772,
    'watchers_count': 772,
    'language': 'HTML',
    'has_issues': true,
    'has_projects': true,
    'has_downloads': true,
    'has_wiki': true,
    'has_pages': false,
    'forks_count': 214,
    'mirror_url': null,
    'archived': false,
    'open_issues_count': 75,
    'license': {
      'key': 'apache-2.0',
      'name': 'Apache License 2.0',
      'spdx_id': 'Apache-2.0',
      'url': 'https://api.github.com/licenses/apache-2.0'
    },
    'forks': 214,
    'open_issues': 75,
    'watchers': 772,
    'default_branch': 'master',
    'organization': {
      'login': 'patternfly',
      'id': 6391110,
      'avatar_url': 'https://avatars3.githubusercontent.com/u/6391110?v=4',
      'gravatar_id': '',
      'url': 'https://api.github.com/users/patternfly',
      'html_url': 'https://github.com/patternfly',
      'followers_url': 'https://api.github.com/users/patternfly/followers',
      'following_url': 'https://api.github.com/users/patternfly/following{/other_user}',
      'gists_url': 'https://api.github.com/users/patternfly/gists{/gist_id}',
      'starred_url': 'https://api.github.com/users/patternfly/starred{/owner}{/repo}',
      'subscriptions_url': 'https://api.github.com/users/patternfly/subscriptions',
      'organizations_url': 'https://api.github.com/users/patternfly/orgs',
      'repos_url': 'https://api.github.com/users/patternfly/repos',
      'events_url': 'https://api.github.com/users/patternfly/events{/privacy}',
      'received_events_url': 'https://api.github.com/users/patternfly/received_events',
      'type': 'Organization',
      'site_admin': false
    },
    'network_count': 214,
    'subscribers_count': 89
  } as any;

  static readonly REPO_ERROR = {
    'message': 'Not Found',
    'documentation_url': 'https://developer.github.com/v3'
  } as any;
}
