import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AuthHelperService,
  Config,
  HelperService,
  TokenProvider
} from 'ngx-launcher';
import { AUTH_API_URL, AuthenticationService } from 'ngx-login-client';
import { AppLauncherRoutingModule } from './app-launcher-routing.module';
import { AppLauncherComponent } from './app-launcher.component';
import { CreateAppModule } from './create-app/create-app.module';
import { ImportAppModule } from './import-app/import-app.module';
import { AuthAPIProvider } from './services/app-launcher-authprovider.service';
import { KeycloakTokenProvider } from './services/token-provider.service';
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
    },
    {
      provide: AuthHelperService,
      useFactory: (AUTH_API_URL) => new AuthAPIProvider(AUTH_API_URL),
      deps: [AUTH_API_URL]
    }
  ],
  declarations: [ AppLauncherComponent ]
})
export class AppLauncherModule {}
