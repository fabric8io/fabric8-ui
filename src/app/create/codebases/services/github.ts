export class GitHubUser {
  "login": string;
  "id": number;
  "avatar_url": string;
  "gravatar_id": string;
  "url": string;
  "html_url": string;
  "followers_url": string;
  "following_url": string;
  "gists_url": string;
  "starred_url": string;
  "subscriptions_url": string;
  "organizations_url": string;
  "repos_url": string;
  "events_url": string;
  "received_events_url": string;
  "type": string;
  "site_admin": boolean;
  "name": string;
  "company": string;
  "blog": string;
  "location": string;
  "email": string;
  "hireable": string;
  "bio": string;
  "public_repos": number;
  "public_gists": number;
  "followers": number;
  "following": number;
  "created_at": string;
  "updated_at": string;
  "total_private_repos": number;
  "owned_private_repos": number;
  "private_gists": number;
  "disk_usage": number;
  "collaborators": number;
  "two_factor_authentication": boolean;
  "plan": {
    "name": string;
    "space": number;
    "private_repos": number;
    "collaborators": number;
  }
}

export class GitHubOwner {
  "login": string;
  "id": number;
  "avatar_url": string;
  "gravatar_id": string;
  "url": string;
  "html_url": string;
  "followers_url": string;
  "following_url": string;
  "gists_url": string;
  "starred_url": string;
  "subscriptions_url": string;
  "organizations_url": string;
  "repos_url": string;
  "events_url": string;
  "received_events_url": string;
  "type": string;
  "site_admin": boolean;
}

// User repos
// https://api.github.com/users/almighty/repos
export class GitHubRepo {
  "id": number;
  "name": string;
  "full_name": string;
  "owner": GitHubOwner;
  "private": boolean;
  "html_url": string;
  "description": string;
  "fork": boolean;
  "url": string;
  "forks_url": string;
  "keys_url": string;
  "collaborators_url": string;
  "teams_url": string;
  "hooks_url": string;
  "issue_events_url": string;
  "events_url": string;
  "assignees_url": string;
  "branches_url": string;
  "tags_url": string;
  "blobs_url": string;
  "git_tags_url": string;
  "git_refs_url": string;
  "trees_url": string;
  "statuses_url": string;
  "languages_url": string;
  "stargazers_url": string;
  "contributors_url": string;
  "subscribers_url": string;
  "subscription_url": string;
  "commits_url": string;
  "git_commits_url": string;
  "comments_url": string;
  "issue_comment_url": string;
  "contents_url": string;
  "compare_url": string;
  "merges_url": string;
  "archive_url": string;
  "downloads_url": string;
  "issues_url": string;
  "pulls_url": string;
  "milestones_url": string;
  "notifications_url": string;
  "labels_url": string;
  "releases_url": string;
  "deployments_url": string;
  "created_at": string;
  "updated_at": string;
  "pushed_at": string;
  "git_url": string;
  "ssh_url": string;
  "clone_url": string;
  "svn_url": string;
  "homepage": string;
  "size": number;
  "stargazers_count": number;
  "watchers_count": number;
  "language": string;
  "has_issues": boolean;
  "has_projects": boolean;
  "has_downloads": boolean;
  "has_wiki": boolean;
  "has_pages": boolean;
  "forks_count": number;
  "mirror_url": string;
  "open_issues_count": number;
  "forks": number;
  "open_issues": number;
  "watchers": number;
  "default_branch": string;
}

// Repo details
// https://api.github.com/repos/almighty/almighty-core
export class GitHubRepoDetails extends GitHubRepo {
  "parent": GitHubRepo;
  "source": GitHubRepo;
  "organization": GitHubOwner;
  "network_count": number;
  "subscribers_count": number;
}

// License
// https://api.github.com/repos/almighty/almighty-core/license
export class GitHubRepoLicense {
  "name": string;
  "path": string;
  "sha": string;
  "size": number;
  "url": string;
  "html_url": string;
  "git_url": string;
  "download_url": string;
  "type": string;
  "content": string;
  "encoding": string;
  "_links": {
    "self": string;
    "git": string;
    "html": string;
  };
  "license": {
    "key": string;
    "name": string;
    "spdx_id": string;
    "url": string;
    "featured": boolean;
  };
}

// Last commit
// https://api.github.com/repos/almighty/almighty-core/git/refs/heads/master
export class GitHubRepoLastCommit {
  "ref": string;
  "url": string;
  "object": {
    "sha": string;
    "type": string;
    "url": string;
  };
}

// Commit
// https://api.github.com/repos/almighty/almighty-core/commits{/sha}
export class GitHubRepoCommit {
  "sha": string;
  "commit": {
    "author": {
      "name": string;
      "email": string;
      "date": string;
    };
    "committer": {
      "name": string;
      "email": string;
      "date": string;
    };
    "message": string;
    "tree": {
      "sha": string;
      "url": string;
    };
    "url": string;
    "comment_count": number;
  };
  "url": string;
  "html_url": string;
  "comments_url": string;
  "author": GitHubOwner;
  "committer": GitHubOwner;
  "parents": [{
      "sha": string;
      "url": string;
      "html_url": string;
  }];
  "stats": {
    "total": number;
    "additions": number;
    "deletions": number;
  };
  "files": [{
    "sha": string;
    "filename": string;
    "status": string;
    "additions": number;
    "deletions": number;
    "changes": number;
    "blob_url": string;
    "raw_url": string;
    "contents_url": string;
    "patch": string;
  }]
}
