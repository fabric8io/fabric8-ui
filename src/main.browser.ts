/**
 * Angular bootstraping
 */
import 'reflect-metadata';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootloader } from '@angularclass/hmr';

/**
 * Offline plugin
 */
// import {install as offlinePluginInstall} from 'offline-plugin/runtime';

/**
 * App Module
 * our top level module that holds all of our components
 */
import { AppModule } from './app';
import { decorateModuleRef } from './app/environment';

/**
 * Import application wide styles
 */
import './assets/stylesheets/fabric8-ui-global-overrides.less';
import './assets/stylesheets/shared/osio.less';

/**
 * Bootstrap our Angular app with a top level NgModule
 */
export function main(): Promise < any > {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(decorateModuleRef)
    .catch(err => console.error(err));
}

// this turns on Service Workers, but it is currently cause us to have to hard refresh twice to see any change
// in production therefore we are turning it off for now.
/*
if ('production' === ENV) {
  offlinePluginInstall();
}
*/

// needed for hmr in prod this is replace for document ready
bootloader(main);
