/**
 * Angular bootstraping
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootloader, hmrModule } from '@angularclass/hmr';
import 'reflect-metadata';

/**
 * Offline plugin
 */
// import { install as offlinePluginInstall } from 'offline-plugin/runtime';

/**
 * App Module
 * our top level module that holds all of our components
 */
import { decorateModuleRef } from './app/environment';
import { AppModule } from './app/index';

/**
 * Bootstrap our Angular app with a top level NgModule
 */
export function main(): Promise<any> {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule, { preserveWhitespaces: true })
    .then((ngModuleRef: any) => (process.env.HMR ? hmrModule(ngModuleRef, module) : ngModuleRef))
    .then(decorateModuleRef)
    .catch((err) => console.error(err));
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
