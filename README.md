# fabric8-ui

[![Build Status](https://ci.centos.org/buildStatus/icon?job=devtools-fabric8-ui-build-master)](https://ci.centos.org/job/devtools-fabric8-ui-build-master)

## Before you start

### Backend API

Make sure you set the URL to the services. For UI development, we recommend connecting to the dev environment API server. 

To connect to the dev enviornment instances: 
* `export FABRIC8_WIT_API_URL="http://api.prod-preview.openshift.io/api/"`
* `export FABRIC8_RECOMMENDER_API_URL="http://api-bayesian.dev.rdu2c.fabric8.io/api/v1/"`

to your `.bash_profile` and reload the shell.

## VS Code

* Run `ext install EditorConfig` to read the .editorconfig file

## To start

Run `npm start`. This will start the UI with livereload enabled. Then navigate to <http://localhost:3000>.

[[continuous-delivery-semantic-relases]]
Continuous Delivery & Semantic Relases
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In ngx-fabric8-wit we use the
https://github.com/semantic-release/semantic-release[semantic-release
plugin]. That means that all you have to do is use the AngularJS Commit
Message Conventions (documented below). Once the PR is merged, a new
release will be automatically published to npmjs.com and a release tag
created on github. The version will be updated following semantic
versionning rules.

[[commit-message-format]]
Commit Message Format
^^^^^^^^^^^^^^^^^^^^^

A commit message consists of a *header*, *body* and *footer*. The header
has a *type*, *scope* and *subject*:

....
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
....

The *header* is mandatory and the *scope* of the header is optional.

Any line of the commit message cannot be longer 100 characters! This
allows the message to be easier to read on GitHub as well as in various
git tools.

[[revert]]
Revert
^^^^^^

If the commit reverts a previous commit, it should begin with `revert:`,
followed by the header of the reverted commit. In the body it should
say: `This reverts commit <hash>.`, where the hash is the SHA of the
commit being reverted.

[[type]]
Type
^^^^

If the prefix is `feat`, `fix` or `perf`, it will always appear in the
changelog.

Other prefixes are up to your discretion. Suggested prefixes are `docs`,
`chore`, `style`, `refactor`, and `test` for non-changelog related
tasks.

[[scope]]
Scope
^^^^^

The scope could be anything specifying place of the commit change. For
example `$location`, `$browser`, `$compile`, `$rootScope`, `ngHref`,
`ngClick`, `ngView`, etc…

[[subject]]
Subject
^^^^^^^

The subject contains succinct description of the change:

* use the imperative, present tense: ``change'' not ``changed'' nor
``changes''
* don’t capitalize first letter
* no dot (.) at the end

[[body]]
Body
^^^^

Just as in the *subject*, use the imperative, present tense: ``change''
not ``changed'' nor ``changes''. The body should include the motivation
for the change and contrast this with previous behavior.

[[footer]]
Footer
^^^^^^

The footer should contain any information about *Breaking Changes* and
is also the place to reference GitHub issues that this commit *Closes*.

*Breaking Changes* should start with the word `BREAKING CHANGE:` with a
space or two newlines. The rest of the commit message is then used for
this.

A detailed explanation can be found in this
https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#[document].

Based on
https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit

[[examples]]
Examples
^^^^^^^^

Appears under ``Features'' header, pencil subheader:

....
feat(pencil): add 'graphiteWidth' option
....

Appears under ``Bug Fixes'' header, graphite subheader, with a link to
issue #28:

....
fix(graphite): stop graphite breaking when width < 0.1

Closes #28
....

Appears under ``Performance Improvements'' header, and under ``Breaking
Changes'' with the breaking change explanation:

....
perf(pencil): remove graphiteWidth option

BREAKING CHANGE: The graphiteWidth option has been removed. The default graphite width of 10mm is always used for performance reason.
....

The following commit and commit `667ecc1` do not appear in the changelog
if they are under the same release. If not, the revert commit appears
under the ``Reverts'' header.

....
revert: feat(pencil): add 'graphiteWidth' option

This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
....

[[commitizen---craft-valid-commit-messages]]
Commitizen - craft valid commit messages
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Commitizen helps you craft correct commit messages. Install it using
`npm install commitizen -g`. Then run `git cz` rather than `git commit`.

[[validate-commit-msg---validate-commit-messages]]
Validate-commit-msg - validate commit messages
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

A github webhook from gitcop validates your commit message
