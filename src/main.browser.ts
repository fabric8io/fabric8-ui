/*
 * Angular bootstraping
 */
import 'reflect-metadata';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {decorateModuleRef} from './app/environment';
import {bootloader} from '@angularclass/hmr';

// Offline plugin

import {install as offlinePluginInstall} from 'offline-plugin/runtime';

/*
 * App Module
 * our top level module that holds all of our components
 */
import {AppModule} from './app';

/*
 * Import application wide styles
 */
import './assets/stylesheets/shared/main.scss';
import './assets/stylesheets/fabric8-ui-global-overrides.scss';

/*
 * Bootstrap our Angular app with a top level NgModule
 */
export function main() : Promise < any > {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(decorateModuleRef)
    .catch(err => console.error(err));
}

if ('production' === ENV) {
  offlinePluginInstall();
}

// needed for hmr in prod this is replace for document ready
bootloader(main);
