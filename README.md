# fabric8-ui

[![Build Status](https://ci.centos.org/buildStatus/icon?job=devtools-fabric8-ui-npm-publish-build-master)](https://ci.centos.org/job/devtools-fabric8-ui-npm-publish-build-master)

## Before you start

### Backend API

Make sure you set the URL to the services. For UI development, we recommend connecting to the dev environment API server. 

To connect to the dev enviornment instances: 
* `export FABRIC8_WIT_API_URL="http://api.prod-preview.openshift.io/api/"`
* `export FABRIC8_RECOMMENDER_API_URL="http://api-bayesian.dev.rdu2c.fabric8.io/api/v1/"`

to your `.bash_profile` and reload the shell.

## VS Code

* Run `ext install EditorConfig` to read the .editorconfig file

## Get dependencies

Run `npm install`. This will download all the required dependencies to be able to start the UI.

## To start

Run `npm start`. This will start the UI with livereload enabled. Then navigate to <http://localhost:3000>.

## CSS and SASS

fabric8-planner uses SASS for it's stylesheets. It also uses the Angular emulation
of the shadow dom, so you will normally want to place your styles in the
`.component.scss` file next to the html and the typescript.

If you find yourself wanting to create a shared style that multiple components will
use, then we recommend adding it as a mixin to
`src/assets/stylesheets/_planner-mixins.scss`. The mixins are imported in to every
`.component.scss` file. You can then create a real class by doing something like

    .my-class {
      @include my-class;
    }

We use mixins to avoid polluting components with uncessary style classes, and to avoid
an explosion of shared files.

The `src/assets/stylesheets/` directory includes a `shared` directory. These are
shared global styles that we will refactor out in to a shared library at some point.
Only update these styles if you are making a truly global style, and are going to
synchronise your changes across all the various UI projects.

## Integrations

fabric8-ui uses rxjs to provide loose coupling between modules (both those in the code base and those integrated via NPM). 
To do this, fabric8-ui makes extensive use of the [Broadcaster](https://github.com/fabric8-ui/ngx-login-client/blob/master/src/app/shared/broadcaster.service.ts).

### Context

#### Space changed

When the current space the user is viewing changes, fabric8-ui broadcasts with the key `spaceChanged` and the  
new [Space](https://github.com/fabric8-ui/ngx-fabric8-wit/blob/master/src/app/models/space.ts) as the payload.

### UI integrations

####  Notifications

To send a notification to the user, the module should import [ngx-fabric8-wit](https://github.com/fabric8-ui/ngx-fabric8-wit)
and inject the `[Notifications](https://github.com/fabric8-ui/ngx-fabric8-wit/blob/master/src/app/notifications/notifications.ts)`
service, and call the `message()` method, passing in a [Notification](https://github.com/fabric8-ui/ngx-fabric8-wit/blob/master/src/app/notifications/notification.ts). You can subscribe to
the result of `message()` to observe any [NotificationAction](https://github.com/fabric8-ui/ngx-fabric8-wit/blob/master/src/app/notifications/notification-action.ts)s that result
from the notification.

## Continuous Delivery & Semantic Relases

In ngx-fabric8-wit we use the
https://github.com/semantic-release/semantic-release[semantic-release
plugin]. That means that all you have to do is use the AngularJS Commit
Message Conventions (documented below). Once the PR is merged, a new
release will be automatically published to npmjs.com and a release tag
created on github. The version will be updated following semantic
versionning rules.

### Commit Message Format

A commit message consists of a **header**, **body** and **footer**.  The header has a **type**, **scope** and **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

### Revert

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

If the prefix is `feat`, `fix` or `perf`, it will always appear in the changelog.

Other prefixes are up to your discretion. Suggested prefixes are `docs`, `chore`, `style`, `refactor`, and `test` for non-changelog related tasks.

### Scope

The scope could be anything specifying place of the commit change. For example `$location`,
`$browser`, `$compile`, `$rootScope`, `ngHref`, `ngClick`, `ngView`, etc...

### Subject

The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

A detailed explanation can be found in this [document][commit-message-format].

Based on https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit

[commit-message-format]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#


### Examples

Appears under "Features" header, pencil subheader:

```
feat(pencil): add 'graphiteWidth' option
```

Appears under "Bug Fixes" header, graphite subheader, with a link to issue #28:

```
fix(graphite): stop graphite breaking when width < 0.1

Closes #28
```

Appears under "Performance Improvements" header, and under "Breaking Changes" with the breaking change explanation:

```
perf(pencil): remove graphiteWidth option

BREAKING CHANGE: The graphiteWidth option has been removed. The default graphite width of 10mm is always used for performance reason.
```

The following commit and commit `667ecc1` do not appear in the changelog if they are under the same release. If not, the revert commit appears under the "Reverts" header.

```
revert: feat(pencil): add 'graphiteWidth' option

This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
```

### Commitizen - craft valid commit messages

Commitizen helps you craft correct commit messages. Install it using `npm install commitizen -g`. Then run `git cz` rather than `git commit`.

### Validate-commit-msg - validate commit messages

The validate-commit-msg githook checks for invalid commit messages.

