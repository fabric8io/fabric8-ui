import { APP_INITIALIZER, NgModule } from '@angular/core';

import { Broadcaster } from 'ngx-base';

import {
  OAuthConfigStore
} from '../../a-runtime-console/index';

import { BootstrapService } from './bootstrap.service';

export function bootstrap(bootstrapService: BootstrapService) {
    return () => bootstrapService.bootstrap();
}

@NgModule({
  providers: [
    Broadcaster,
    OAuthConfigStore,
    BootstrapService,
    { provide: APP_INITIALIZER, useFactory: bootstrap, deps: [BootstrapService], multi: true }
  ]
})
export class BootstrapModule { }
