import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import {
  AuthHelperService,
  Config,
  HelperService,
  TokenProvider
} from 'ngx-forge';
import { AUTH_API_URL, AuthenticationService } from 'ngx-login-client';

import { KeycloakTokenProvider } from '../forge-wizard/service/token-provider';
import { AppLauncherRoutingModule } from './app-launcher-routing.module';
import { AppLauncherComponent } from './app-launcher.component';
import { CreateAppModule } from './create-app/create-app.module';
import { ImportAppModule } from './import-app/import-app.module';
import { NewForgeConfig } from './shared/new-forge.config';

@NgModule({
  imports: [
    AppLauncherRoutingModule,
    CommonModule,
    CreateAppModule,
    ImportAppModule
  ],
  providers: [
    HelperService,
    { provide: Config, useClass: NewForgeConfig },
    {
      provide: TokenProvider,
      useFactory: (auth: AuthenticationService) => new KeycloakTokenProvider(auth),
      deps: [AuthenticationService]
    }
  ],
  declarations: [ AppLauncherComponent ]
})
export class AppLauncherModule {
  constructor(http: Http) {}
}
