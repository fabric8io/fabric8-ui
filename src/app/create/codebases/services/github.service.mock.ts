import { Context, Contexts } from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { GitHubRepoCommit, GitHubRepoDetails, GitHubRepo, GitHubRepoLicense } from "app/create/codebases/services/github";
import { cloneDeep } from 'lodash';

export const currentContext: Context = {
  "user": {
    "attributes": {
      "bio": "",
      "email": "corinnekrych@gmail.com",
      "fullName": "Corinne Krych",
      "imageURL": "https://www.gravatar.com/avatar/20a907ee0ab0e4756e19727209d0ac64.jpg",
      "url": "",
      "username": "corinnekrych"
    },
    "id": "c21f2ece-21f0-4e7f-b9ab-b49b8dd0d752",
    "links": {
      "self": "https://api.prod-preview.openshift.io/api/users/c21f2ece-21f0-4e7f-b9ab-b49b8dd0d752"
    },
    "type": "identities"
  },
  "space": {
    "name": "mime",
    "path": "mypath",
    "teams": [],
    "defaultTeam": { name: "defaultteam", members: [] },
    "attributes": {
      "created-at": "2017-04-27T13:05:49.090854Z",
      "description": "",
      "name": "tototo",
      "updated-at": "2017-04-27T13:05:49.090854Z",
      "version": 0
    },
    "id": "1d7af8bf-0346-432d-9096-4e2b59d2db87",
    "links": {
      "self": "https://api.prod-preview.openshift.io/api/spaces/1d7af8bf-0346-432d-9096-4e2b59d2db87",
      "workitemlinktypes": "https://api.prod-preview.openshift.io/api/spaces/1d7af8bf-0346-432d-9096-4e2b59d2db87/workitemlinktypes",
      "workitemtypes": "https://api.prod-preview.openshift.io/api/spaces/1d7af8bf-0346-432d-9096-4e2b59d2db87/workitemtypes"
    },
    "relationships": {
      "areas": {
        "links": {
          "related": "https://api.prod-preview.openshift.io/api/spaces/1d7af8bf-0346-432d-9096-4e2b59d2db87/areas"
        }
      },
      "iterations": {
        "links": {
          "related": "https://api.prod-preview.openshift.io/api/spaces/1d7af8bf-0346-432d-9096-4e2b59d2db87/iterations"
        }
      },
      "owned-by": {
        "data": {
          "id": "c21f2ece-21f0-4e7f-b9ab-b49b8dd0d752",
          "type": "identities"
        }
      }
    },
    "type": "spaces"
  },
  "type": {
    "name": "Space",
    "icon": "fa fa-th-large",
  },
  "name": "tototo",
  "path": "/coq/tototo"
};

export class ContextsMock {
  current: Observable<Context>;
  constructor() {
    this.current = Observable.of(currentContext);
  }
}
export const expectedGitHubRepo: GitHubRepo =
{
  "id": 54260706,
  "name": "almighty-core",
  "full_name": "fabric8-services/fabric8-wit",
  "owner": {
    "login": "almighty",
    "id": 17783151,
    "avatar_url": "https://avatars2.githubusercontent.com/u/17783151?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/almighty",
    "html_url": "https://github.com/almighty",
    "followers_url": "https://api.github.com/users/almighty/followers",
    "following_url": "https://api.github.com/users/almighty/following{/other_user}",
    "gists_url": "https://api.github.com/users/almighty/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/almighty/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/almighty/subscriptions",
    "organizations_url": "https://api.github.com/users/almighty/orgs",
    "repos_url": "https://api.github.com/users/almighty/repos",
    "events_url": "https://api.github.com/users/almighty/events{/privacy}",
    "received_events_url": "https://api.github.com/users/almighty/received_events",
    "type": "Organization",
    "site_admin": false
  },
  "private": false,
  "html_url": "https://github.com/fabric8-services/fabric8-wit",
  "description": null,
  "fork": false,
  "url": "https://api.github.com/repos/fabric8-services/fabric8-wit",
  "forks_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/forks",
  "keys_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/keys{/key_id}",
  "collaborators_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/collaborators{/collaborator}",
  "teams_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/teams",
  "hooks_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/hooks",
  "issue_events_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/issues/events{/number}",
  "events_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/events",
  "assignees_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/assignees{/user}",
  "branches_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/branches{/branch}",
  "tags_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/tags",
  "blobs_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/git/blobs{/sha}",
  "git_tags_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/git/tags{/sha}",
  "git_refs_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/git/refs{/sha}",
  "trees_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/git/trees{/sha}",
  "statuses_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/statuses/{sha}",
  "languages_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/languages",
  "stargazers_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/stargazers",
  "contributors_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/contributors",
  "subscribers_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/subscribers",
  "subscription_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/subscription",
  "commits_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/commits{/sha}",
  "git_commits_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/git/commits{/sha}",
  "comments_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/comments{/number}",
  "issue_comment_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/issues/comments{/number}",
  "contents_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/contents/{+path}",
  "compare_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/compare/{base}...{head}",
  "merges_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/merges",
  "archive_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/{archive_format}{/ref}",
  "downloads_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/downloads",
  "issues_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/issues{/number}",
  "pulls_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/pulls{/number}",
  "milestones_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/milestones{/number}",
  "notifications_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/notifications{?since,all,participating}",
  "labels_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/labels{/name}",
  "releases_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/releases{/id}",
  "deployments_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/deployments",
  "created_at": "2016-03-19T10:42:15Z",
  "updated_at": "2017-04-27T12:19:16Z",
  "pushed_at": "2017-05-05T09:59:17Z",
  "git_url": "git://github.com/fabric8-services/fabric8-wit.git",
  "ssh_url": "git@github.com:fabric8-services/fabric8-wit.git",
  "clone_url": "https://github.com/fabric8-services/fabric8-wit.git",
  "svn_url": "https://github.com/fabric8-services/fabric8-wit",
  "homepage": "http://devdoc.almighty.io/",
  "size": 7794,
  "stargazers_count": 25,
  "watchers_count": 25,
  "language": "Go",
  "has_issues": true,
  "has_projects": true,
  "has_downloads": true,
  "has_wiki": false,
  "has_pages": false,
  "forks_count": 44,
  "mirror_url": null,
  "open_issues_count": 250,
  "forks": 44,
  "open_issues": 250,
  "watchers": 25,
  "default_branch": "master",
}
const owner = {
    "login": "almighty",
    "id": 17783151,
    "avatar_url": "https://avatars2.githubusercontent.com/u/17783151?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/almighty",
    "html_url": "https://github.com/almighty",
    "followers_url": "https://api.github.com/users/almighty/followers",
    "following_url": "https://api.github.com/users/almighty/following{/other_user}",
    "gists_url": "https://api.github.com/users/almighty/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/almighty/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/almighty/subscriptions",
    "organizations_url": "https://api.github.com/users/almighty/orgs",
    "repos_url": "https://api.github.com/users/almighty/repos",
    "events_url": "https://api.github.com/users/almighty/events{/privacy}",
    "received_events_url": "https://api.github.com/users/almighty/received_events",
    "type": "Organization",
    "site_admin": false
  };
export let expectedGitHubRepoDetails = cloneDeep(expectedGitHubRepo);
(expectedGitHubRepoDetails as GitHubRepoDetails).parent = expectedGitHubRepo;
(expectedGitHubRepoDetails as GitHubRepoDetails).source = expectedGitHubRepo;
(expectedGitHubRepoDetails as GitHubRepoDetails).organization = owner;
(expectedGitHubRepoDetails as GitHubRepoDetails).network_count = 44;
(expectedGitHubRepoDetails as GitHubRepoDetails).subscribers_count = 26;

export const expectedGitHubRepoLicense: GitHubRepoLicense = {
  "name": "LICENSE",
  "path": "LICENSE",
  "sha": "8dada3edaf50dbc082c9a125058f25def75e625a",
  "size": 11357,
  "url": "https://api.github.com/repos/fabric8-services/fabric8-wit/contents/LICENSE?ref=master",
  "html_url": "https://github.com/fabric8-services/fabric8-wit/blob/master/LICENSE",
  "git_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/git/blobs/8dada3edaf50dbc082c9a125058f25def75e625a",
  "download_url": "https://raw.githubusercontent.com/fabric8-services/fabric8-wit/master/LICENSE",
  "type": "file",
  "content": "LOOOONG_CONTENT",
  "encoding": "base64",
  "_links": {
    "self": "https://api.github.com/repos/fabric8-services/fabric8-wit/contents/LICENSE?ref=master",
    "git": "https://api.github.com/repos/fabric8-services/fabric8-wit/git/blobs/8dada3edaf50dbc082c9a125058f25def75e625a",
    "html": "https://github.com/fabric8-services/fabric8-wit/blob/master/LICENSE"
  },
  "license": {
    "key": "apache-2.0",
    "name": "Apache License 2.0",
    "spdx_id": "Apache-2.0",
    "url": "https://api.github.com/licenses/apache-2.0",
    "featured": true
  }
};

export const expectedGitHubRepoCommit: GitHubRepoCommit = {
  "sha": "225368a414f88bd3c45fd686496a924a15ef81b0",
  "commit": {
    "author": {
      "name": "Alexey Kazakov",
      "email": "alkazako@redhat.com",
      "date": "2017-04-29T22:55:26Z"
    },
    "committer": {
      "name": "GitHub",
      "email": "noreply@github.com",
      "date": "2017-04-29T22:55:26Z"
    },
    "message": "Add ALMIGHTY_AUTH_NOTAPPROVED_REDIRECT (#1278)",
    "tree": {
      "sha": "63d68360bab70fc7e9f74544fd9c358b4ef97567",
      "url": "https://api.github.com/repos/fabric8-services/fabric8-wit/git/trees/63d68360bab70fc7e9f74544fd9c358b4ef97567"
    },
    "url": "https://api.github.com/repos/fabric8-services/fabric8-wit/git/commits/225368a414f88bd3c45fd686496a924a15ef81b0",
    "comment_count": 0
  },
  "url": "https://api.github.com/repos/fabric8-services/fabric8-wit/commits/225368a414f88bd3c45fd686496a924a15ef81b0",
  "html_url": "https://github.com/fabric8-services/fabric8-wit/commit/225368a414f88bd3c45fd686496a924a15ef81b0",
  "comments_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/commits/225368a414f88bd3c45fd686496a924a15ef81b0/comments",
  "author": {
    "login": "alexeykazakov",
    "id": 620087,
    "avatar_url": "https://avatars0.githubusercontent.com/u/620087?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/alexeykazakov",
    "html_url": "https://github.com/alexeykazakov",
    "followers_url": "https://api.github.com/users/alexeykazakov/followers",
    "following_url": "https://api.github.com/users/alexeykazakov/following{/other_user}",
    "gists_url": "https://api.github.com/users/alexeykazakov/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/alexeykazakov/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/alexeykazakov/subscriptions",
    "organizations_url": "https://api.github.com/users/alexeykazakov/orgs",
    "repos_url": "https://api.github.com/users/alexeykazakov/repos",
    "events_url": "https://api.github.com/users/alexeykazakov/events{/privacy}",
    "received_events_url": "https://api.github.com/users/alexeykazakov/received_events",
    "type": "User",
    "site_admin": false
  },
  "committer": {
    "login": "web-flow",
    "id": 19864447,
    "avatar_url": "https://avatars0.githubusercontent.com/u/19864447?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/web-flow",
    "html_url": "https://github.com/web-flow",
    "followers_url": "https://api.github.com/users/web-flow/followers",
    "following_url": "https://api.github.com/users/web-flow/following{/other_user}",
    "gists_url": "https://api.github.com/users/web-flow/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/web-flow/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/web-flow/subscriptions",
    "organizations_url": "https://api.github.com/users/web-flow/orgs",
    "repos_url": "https://api.github.com/users/web-flow/repos",
    "events_url": "https://api.github.com/users/web-flow/events{/privacy}",
    "received_events_url": "https://api.github.com/users/web-flow/received_events",
    "type": "User",
    "site_admin": false
  },
  "parents": [
    {
      "sha": "8d91e778ab952edbeb983018e3e501ead726003d",
      "url": "https://api.github.com/repos/fabric8-services/fabric8-wit/commits/8d91e778ab952edbeb983018e3e501ead726003d",
      "html_url": "https://github.com/fabric8-services/fabric8-wit/commit/8d91e778ab952edbeb983018e3e501ead726003d"
    }
  ],
  "stats": {
    "total": 5,
    "additions": 5,
    "deletions": 0
  },
  "files": [
    {
      "sha": "42542ba1d4a7c55c6d639610b14f8ab16df1b09b",
      "filename": "openshift/core.app.yaml",
      "status": "modified",
      "additions": 5,
      "deletions": 0,
      "changes": 5,
      "blob_url": "https://github.com/fabric8-services/fabric8-wit/blob/225368a414f88bd3c45fd686496a924a15ef81b0/openshift/core.app.yaml",
      "raw_url": "https://github.com/fabric8-services/fabric8-wit/raw/225368a414f88bd3c45fd686496a924a15ef81b0/openshift/core.app.yaml",
      "contents_url": "https://api.github.com/repos/fabric8-services/fabric8-wit/contents/openshift/core.app.yaml?ref=225368a414f88bd3c45fd686496a924a15ef81b0",
      "patch": "@@ -80,6 +80,11 @@ objects:\n               configMapKeyRef:\n                 name: core\n                 key: postgres.connection.maxopen\n+          - name: ALMIGHTY_AUTH_NOTAPPROVED_REDIRECT\n+            valueFrom:\n+              configMapKeyRef:\n+                name: core\n+                key: auth_notapproved_redirect\n           - name: ALMIGHTY_TENANT_SERVICEURL\n             valueFrom:\n               secretKeyRef:"
    }]
};
