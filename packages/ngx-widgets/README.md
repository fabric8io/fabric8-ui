# ngx-widgets

[![Build Status](https://ci.centos.org/buildStatus/icon?job=devtools-ngx-widgets-npm-publish-build-master)](https://ci.centos.org/view/Devtools/job/devtools-ngx-widgets-npm-publish-build-master/)
[![Build Status](http://jenkins.cd.test.fabric8.io/job/fabric8-ui/job/ngx-widgets/job/master/)](http://jenkins.cd.test.fabric8.io/job/fabric8-ui/job/ngx-widgets/job/master/)
[![npm version](https://badge.fury.io/js/ngx-widgets.svg)](https://badge.fury.io/js/ngx-widgets)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A collection of Angular components and other useful things to be shared.

You can see how it is used in our application [here](https://github.com/fabric8io/fabric8-ui).

The system we build is composed of several components existing in separate repos but
sharing common components, directives, and pipes. These widgets were extracted to
provide a shared set of services.

## Getting started:

This library does not run on it's own. It must be imported.

`npm install ngx-widgets`

There are several services and a couple of models used by them available.

    container-toggle
    dialog
    dropdown
    editable
    icon
    infinitescroll

## Building it

#### Install the dependencies:

`npm install`

#### If you need to update the dependencies you can reinstall:

`npm run reinstall`

#### Run the tests:

`npm test`

#### Run Stylelint checks

'gulp lint-less'

## Library Build

### Production

To build ngx-widgets as a npm library, use:

---

## npm run build

Whilst the standalone build uses webpack the library build uses gulp.

The created library is located in `dist`. You shouldn't ever publish the
build manually, instead you should let the CD pipeline do a semantic release.

### Development

To build ngx-widgets as an npm library and embed it into a webapp such as
fabric8-ui, you should:

1. Run `npm run watch:library` in this directory. This will build ngx-widgets as
   a library and then set up a watch task to rebuild any ts, html and less files you
   change.
2. In the webapp into which you are embedding, run `npm link <path to ngx-widgets>/dist-watch --production`.
   This will create a symlink from `node_modules/ngx-widgets` to the `dist-watch` directory
   and install that symlinked node module into your webapp.
3. Run your webapp in development mode, making sure you have a watch on `node_modules/ngx-widgets`
   enabled. To do this using a typical Angular Webpack setup, such as the one based on Angular Class,
   just run `npm start`. You will have access to both JS sourcemaps and LESS sourcemaps if your webapp
   is properly setup.

Note that `fabric8-ui` is setup to do reloading and sourcemaps automatically when you
run `npm start`.

## Continuous Delivery & Semantic Relases

In ngx-widgets we use the [semantic-release plugin](https://github.com/semantic-release/semantic-release). That means
that all you have to do is use the AngularJS Commit Message Conventions (documented below). Once the PR is merged, a new release will be automatically published to npmjs.com and a release tag
created on github. The version will be updated following semantic versionning rules.

### Commit Message Format

A commit message consists of a **header**, **body** and **footer**. The header has a **type**, **scope** and **subject**:

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

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

If the prefix is `feat`, `fix` or `perf`, it will always appear in the changelog.

Other prefixes are up to your discretion. Suggested prefixes are `docs`, `chore`, `style`, `refactor`, and `test` for non-changelog related tasks.

### Scope

The scope could be anything specifying place of the commit change. For example `$location`,
`$browser`, `$compile`, `$rootScope`, `ngHref`, `ngClick`, `ngView`, etc...

### Subject

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

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
