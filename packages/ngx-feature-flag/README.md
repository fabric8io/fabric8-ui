[![Build Status](https://ci.centos.org/buildStatus/icon?job=devtools-ngx-feature-flag-npm-publish-build-master)](https://ci.centos.org/job/devtools-ngx-feature-flag-npm-publish-build-master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
# ngx-feature-flag

## Purpose
The main motivation for doing feature toggling is to decouple the process for deploying code to production and releasing new features. This helps reducing risk, and allow us to easily manage which features to enable

Feature toggles decouple deployment of code from release of new features. For more insight, read [Martin Fowler's](https://martinfowler.com/bliki/FeatureToggle.html) and [Pete Hodgson's Feature flag, A/B testing article](https://martinfowler.com/articles/feature-toggles.html)

The fabric8 feature toggles is based on [unleash](https://github.com/Unleash/unleash) upstream open source project. 
* [fabric8-toggles](https://github.com/fabric8-services/fabric8-toggles) is where the server and its DB run.
* [fabric8-toggles-service](https://github.com/fabric8-services/fabric8-toggles-service) is the service used by fabric8-ui to turn on/off and roll out features. `fabric8-ui` targets `fabric8-toggles-service`.
* [fabric8-ui in feature-flag module](https://github.com/fabric8-ui/fabric8-ui/tree/master/src/app/feature-flag) is where the angular components and services for toggles are.

## Admin console
Admin consoles are available here:
* [Prod UI](http://admin-dsaas-production.09b5.dsaas.openshiftapps.com/toggles/)
* [Preview UI](http://admin-dsaas-preview.b6ff.rh-idev.openshiftapps.com/toggles/)

> NOTE: atm, we dont have any sync mechanism between the 2 instances. This is 2 separate DB.


### How to login?
To login to toggles admin console, we use GitHub authentication and we provide some authorisation checking that your user is part of some organisation.
* You will be prompted to authenticate though GH.
* If not yet part of the [RHDT organisation](https://github.com/rhdt-dev), please open a house keeping issues (under VPN)
* If you're already part of the [RHDT organisation](https://github.com/rhdt-dev) but not a member of either [prod-preview](https://github.com/orgs/rhdt-dev/teams/toggles-admin-preprod/members) or [prod team](https://github.com/orgs/rhdt-dev/teams/toggles-admin-prod/members), contact some admins in mattermost #fabric8-platform and ask them to add you. you will need to be an internal user to be granted access. Once granted, try again.

### How to logout?
Search for `Sign out` in the admin console. You will be logged out of fabric8-toggles admin ui but not logged out of GH. If you want to login with a different GH account, logout of GH.

## Getting started

* You can import the lib in your application:

`npm install ngx-feature-flag`

* or use the demo app:

```shell
npm run build:demo
npm run start:demo
```
  
## Build 
 
* Pre-requisites
  * node 8.3.0
  * npm 5.3.0

* Install the dependencies
 
```
npm install
```
 
* Run the tests
 
```
npm test
```
 
## Usage

### FeatureTogglesService
Use the service directly to request the Feature.
#### use case 1: My feature is a module accessible by routing
Take the new launchpad wizard as an example:
* In admin ui, add your new feature with a `featureName` (here `AppLauncher`), associate a `enableByLevel` strategy, enter the `level` parameter (`internal`, `experimental`, `beta`, `released`).
* [routing file](https://github.com/fabric8-ui/fabric8-ui/commit/b7a519c884829acc24b5c890608516e777d7e004#diff-959f71d9b4ce6d41e637aaf363c42a18): add `FeatureFlagResolver`(responsible to query the `fabric8-toggles-service`, also specify the name of your feature in `featureName`. Here `AppLauncher` should exactly match the feature name (ie: this is the external key between fabric8-ui and fabric8-toggles) defined in fabric8-toggles admin UI.
```
  {
    path: '_applauncher',
    resolve: {
      featureFlagConfig: FeatureFlagResolver
    },
    loadChildren: './app-launcher/app-launcher.module#AppLauncherModule',
    data: {
      title: 'App Launcher',
      featureName: 'AppLauncher'
    }
  },
```
* [add your feature to the context](https://github.com/fabric8-ui/fabric8-ui/commit/b7a519c884829acc24b5c890608516e777d7e004#diff-bd6978b546f7bb2e79fe4e8ea80f12a7): this is where fabrci8-ui queries the fabric8-toggles-service to display (or not) the menu. This is required only for menu (ie: routing) main feature.

#### use case 2: My feature is accessible on to a given set of user emails
Atm we have 2 rollout strategies to use with `fabric8-toggles-service`:

* Enable by level
`enableByLevel` is the most commonly used. It allows to tag a feature for a particular level. Feature flag level are: `internal`, `experimental`, `beta`, `released`.
  * `internal` will only show it to accounts with an @redhat.com email. It will have a notification on the screen: "This feature is open to Red Hat users only. You can manage pre-production features on your profile page." 
  * `experimental` will be "This feature is experimental. You can manage pre-production features on your profile page." 
  * `beta` notification will be "This feature is in beta. You can manage pre-production features on your profile page." 
  * `released` makes the feature default for everyone.

> NOTE: Anonymous user can only see the `released` state. For other level, you need to be logged-in.

* Enable by emails.
`enableByEmails` is used for a work in progress feature. You can create a feature with the strategy `emableByEmails` and then list the different users' emails of the other developers you want to collaborate with on this WIP feature.

For example, while working on `new dashboard` feature, Adam wanted to share the new dashboard only with a group of UI developers. Easy way is to used the `enableByEmails`. Once the feature is ready, Adam could removes the strategy `enableByEmails and replace it with a strategy `enableByLevel` with a level of `internal` to start with.

### Compoment
`ngx-feature-flag` provides 2 components to help you hide and show your features under feature-flag.
#### use case 1: My feature is a component I want to hide/show
For example, let's hide `EnvironmentWidgetComponent`.
* In unleash admin ui, add your new feature with a `featureName` (here `Test`), associate a `enableByLevel` strategy, enter the `level` parameter (`internal`, `experimental`, `beta`, `released`). If this level (for ex: experimental) is below your user-consent level (for ex: beta), you won't see the component. 
* In your page or component template:
```
<f8-feature-toggle featureName="Test">
  <div user-level>
    YOUR HTML
  </div>
</f8-feature-toggle>
```
* In your Module, import `FeatureFlagModule`:
```
@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, MomentModule, FeatureFlagModule ],
  declarations: [EnvironmentWidgetComponent],
  exports: [EnvironmentWidgetComponent]
})
export class EnvironmentWidgetModule { }
```

> NOTE: the component is hidden but still initialized.

#### use case 2: My feature is a refactored component I want to hide/show
Similar to precedent section. You put the new code in the HTML element that content `user-level` and the old code in `default-level`.

For example:

```
<f8-feature-toggle featureName="Analyze.newSpaceDashboard"
  <div id="analyze-overview-dashboard" class="container-fluid analyze-overview-wrapper" user-level>
  YOUR NEW HTML
  </div>
  <div id="" class="container-fluid analyze-overview-wrapper" default-level>
  YOUR OLD HTML
  </div>
</f8-feature-toggle>
```

#### use case 3: My feature is a component I want to dynamically load
This use case could be while the feature is under development and you want to make sure loading the component will not break the whole UI.

For example, let's dynamically load `EnvironmentWidgetComponent` to carry-on with the same example. but now we don't want to just hide the component, we want to make sure the component code is not loaded at all (this could be useful if for some reasons the component code ma cause runtime failure).
* In unleash admin ui, add your new feature with a `featureName` (here `Test`), associate a `enableByLevel` strategy, enter the `level` parameter (`internal`, `experimental`, `beta`, `released`). If this level (for ex: experimental) is below your user-consent level (for ex: beta), you won't see the component. 
* In `analyze-overview.component.html` template, replace `<fabric8-environment-widget />` by `<f8-feature-toggle-loader featureName="Test"></f8-feature-toggle-loader>` where `Test` is the name of the feature. Choose an meaningful name like: `env.widget`. For test purpose here we reuse `Test`.
* In the module associated to your dynamically loaded component add an `entryComponents`. For ex, in `analyze-overview.module.ts`:
```
@NgModule({
  imports: [
    CommonModule,
    AnalyzeOverviewRoutingModule,
    FeatureFlagModule,
    FormsModule,
    EditSpaceDescriptionWidgetModule,
    AnalyticalReportWidgetModule,
    CreateWorkItemWidgetModule,
    AddCodebaseWidgetModule,
    PipelinesWidgetModule,
    EnvironmentWidgetModule,
    ForgeWizardModule,
    ModalModule.forRoot()
  ],
  declarations: [AnalyzeOverviewComponent],
  entryComponents: [EnvironmentWidgetComponent]
})
export class AnalyzeOverviewModule {
  constructor(http: Http) { }
}
```
Because we use Feature-flag, we've also added `FeatureFlagModule` in the imports of the module.
> Note: For more information on `entryComponents` read angular docs on [entryComponents](https://angular.io/guide/entry-components) and [dynamic component load](https://angular.io/guide/dynamic-component-loader).

* Tell fabric8-ui which feature match which component. In `src/app/feature-flag.mapping.ts`, add a `case` in `convertFeatureNameToComponent` method:
```
  convertFeatureNameToComponent(name: string): Type<any> {
    switch (name) {
      case 'Test': {
        return EnvironmentWidgetComponent;
      }
      default: {
        return null;
      }
    }
  }
```


## Demo

Better than just usage you want to see it in action? run the demo:
* with direct access to [prod-preview]() uncomment []()
* with mock data (default option)


```
npm run build:demo
npm run start:demo

```

Go to http://localhost:8001 

## Release

* pre-requisites
Login to [npmjs central repo](https://www.npmjs.com/) with your credential (you should be owner of the library).

* build `ngx-feature-flag` as a npm library

```
npm run build   
```

* publish
```
npm publish dist
```

> Note: semantic release are done via fabric8cd using `semantic-release`


