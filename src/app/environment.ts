
// Angular 2
// rc2 workaround
import { ApplicationRef, enableProdMode } from '@angular/core';
import { enableDebugTools } from '@angular/platform-browser';
import { StaticInjector } from 'ngx-launcher';

// Environment Providers
let PROVIDERS: any[] = [
  // common env directives
];

// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
let _decorateModuleRef = function identity<T>(value: T): T { return value; };

if ('production' === ENV) {
  // Production
  // disableDebugTools(); // https://github.com/qdouble/angular-webpack2-starter/issues/263
  enableProdMode();

  /* Below code is needed to get the broadcaster instance from AppModule which is
  used in `ngx-launcher` to broadcast events for telemetry */
  _decorateModuleRef = (modRef: any) => {
    StaticInjector.setInjector(modRef.injector);
  };

  PROVIDERS = [
    ...PROVIDERS
    // custom providers in production
  ];

} else {

  _decorateModuleRef = (modRef: any) => {
    const appRef = modRef.injector.get(ApplicationRef);
    const cmpRef = appRef.components[0];

    let _ng = (<any> window).ng;
    enableDebugTools(cmpRef);
    (<any> window).ng.probe = _ng.probe;
    (<any> window).ng.coreTokens = _ng.coreTokens;

    /* Below line is needed to get the broadcaster instance from AppModule which is
    used in `ngx-launcher` to broadcast events for telemetry */
    StaticInjector.setInjector(modRef.injector);

    return modRef;
  };

  // Development
  PROVIDERS = [
    ...PROVIDERS
    // custom providers in development
  ];

}

export const decorateModuleRef = _decorateModuleRef;

export const ENV_PROVIDERS = [
  ...PROVIDERS
];
