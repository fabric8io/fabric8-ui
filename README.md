# fabric8-ui

[![Build Status](https://ci.centos.org/buildStatus/icon?job=devtools-fabric8-ui-npm-publish-build-master)](https://ci.centos.org/job/devtools-fabric8-ui-npm-publish-build-master)
[![codecov](https://codecov.io/gh/fabric8io/fabric8-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/fabric8io/fabric8-ui)

## Development environment
### Run fabric8-ui with remote backends

You need to setup your shell to point to the right cluster so that it can talk to the required back end services like KeyCloak, WIT, Forge, OpenShift etc.  

We provide various sample environments out of the box which make it easier to get started. They are all located as bash scripts in `environments`.  

The default one you should use when you want to develop on the console is to reuse openshift.io production cluster:

```bash
source environments/openshift-prod-cluster.sh
```

There are others too. For example if you want to try [run fabric8 locally on minishift](https://github.com/fabric8io/fabric8-platform#v-4x-pre-release-development) and connect fabric8-ui to it then try:

```bash
source environments/local-cluster.sh
```

> NOTE: If you want to target a local WIT backend, check our wiki [How To pages](https://github.com/fabric8-ui/fabric8-ui/wiki/How-to...#how-to-run-local-fabric8-ui-with-local-wit).

### Build and Run

Run `npm install`. 
This will download all the required dependencies to be able to start the UI.


Run `npm start`. This will start the UI with live reload enabled. Then navigate to <http://localhost:3000>.

### VS Code

Run `ext install EditorConfig` to read the .editorconfig file


## HTML, CSS and Less
| [Code Guidelines](https://fabric8-ui.github.io/fabric8-ux/code-guidelines)

fabric8-ui uses HTML5 elements where appropriate, and practices
**practicality over purity**. Use the least amount of markup with the fewest intricacies as possible.

Attribution order, syntax definitions and declaration order are an important aspect of the fabric8-ui code and should be followed according the the guidelines.

fabric8-ui uses Less for it's stylesheets. If you find yourself wanting to create a shared style that multiple components will
use, then we recommend adding it to an existing `.less` file in the `src/assets/stylesheets/shared/` directory. Only update these styles if you are making a truly global style, and are going to synchronize your changes across all of the various UI projects.

If you only want to make a change to a specific component, do so in that component's `.less` file, according to Angular best practices.

The file `osio.less` is imported into every component Less file using `@import (reference)`, so all files inside of the `/shared` directory will be used by each component.

## Code Quality
fabric8-ui utilizes [stylelint](https://github.com/stylelint/stylelint) and [htmlhint](https://github.com/yaniswang/HTMLHint) to check the `less` and `html` code. As part of each linter, we include three files: `.stylelintrc`, `.stylelintignore` and `.htmlhintrc`.

The `.stylelintrc` configuration file controls our configuration for the stylelinter, which only checks folders and files that are not included in the `.stylelintignore` file. This allows us to exclude certain areas of the application, as needed.

The `.htmlhintrc` configuration file controls our HTML verification configuration. In the creation of this configuration, we have taken into account the various Angular elements that will exist in the HTML pages.

### Running the code quality checks

Each linter is built into the build process, so running `npm run build` or `npm start` will display any errors, their location (file name and line number), and any error message(s). Whenever a file that is watched by the code quality checks is changed, the build (if started with `npm start`) will re-run, checking only the altered files.

If you would like to run either of these checks individually, without kicking off a full build, you can do so by installing stylelint and htmlhint globally:

```
npm install stylelint -g
npm install htmlhint -g
```

After installing stylelint and htmlhint globally, you can run the following commands:
* `stylelint "**/*.less"`

This will run stylelint against all `.less` files in fabric8-ui/src, using the `.stylelintrc` configuration file.

* `htmlhint`

This will run htmlhint against all `html` files in fabric8-ui/src, using the `.htmlhintrc` configuration file. This command **will not** ignore the files and folders dictated in the `webpack.common.js` file, leading to the possibility of errors being displayed that will not appear at build time.

Alternatively, if you would like to check a subset of folders, or a specific file, you can do so by altering your htmlhint command:
  ```
    cat src/app/layout/header/header.component.html | htmlhint stdin
  ```

## Integrations

fabric8-ui uses rxjs to provide loose coupling between modules (both those in the code base and those integrated via NPM).
To do this, fabric8-ui makes extensive use of the [Broadcaster](https://github.com/fabric8-ui/ngx-base/blob/master/src/app/broadcaster.service.ts).

### Context

#### Space changed

When the current space the user is viewing changes, fabric8-ui broadcasts with the key `spaceChanged` and the  
new [Space](https://github.com/fabric8-ui/ngx-fabric8-wit/blob/master/src/app/models/space.ts) as the payload.

### UI integrations

####  Notifications

To send a notification to the user, the module should import [ngx-fabric8-wit](https://github.com/fabric8-ui/ngx-fabric8-wit)
and inject the [Notifications](https://github.com/fabric8-ui/ngx-base/blob/master/src/app/notifications/notifications.ts)
service, and call the `message()` method, passing in a [Notification](https://github.com/fabric8-ui/ngx-base/blob/master/src/app/notifications/notification.ts). You can subscribe to
the result of `message()` to observe any [NotificationAction](https://github.com/fabric8-ui/ngx-base/blob/master/src/app/notifications/notification-action.ts)s that result
from the notification.

## Continuous Delivery & Semantic Releases

In ngx-fabric8-wit we use the
[semantic-release
plugin](https://github.com/semantic-release/semantic-release). That means that all you have to do is use the AngularJS Commit
Message Conventions (documented below). Once the PR is merged, a new
release will be automatically published to npmjs.com and a release tag
created on GitHub. The version will be updated following semantic
versioning rules.

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

If the prefix is `fix`, `feat`,  or `perf`, it will always appear in the changelog.

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

Appears under "Features" header, pencil sub-header:

```
feat(pencil): add 'graphiteWidth' option
```

Appears under "Bug Fixes" header, graphite sub-header, with a link to issue #28:

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



