import { NoNotifications } from './shared/no-notifications.service';
import { SpaceNamespaceService } from './kubernetes/service/space-namespace.service';
import { SpaceNamespace } from './kubernetes/model/space-namespace';
import './rxjs-extensions';

import {BrowserModule} from "@angular/platform-browser";
import {NgModule, APP_INITIALIZER} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule, Http} from "@angular/http";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {RestangularModule} from "ng2-restangular";
import {AppRoutingModule} from "./approuting/approuting.module";

import {Fabric8CommonModule} from "./common/common.module";
import {AppComponent} from "./app.component";
import {ConfigService, configServiceInitializer} from "./config.service";
import {KubernetesUIModule} from "./kubernetes/ui/ui.module";
import {KubernetesStoreModule} from "./kubernetes/kubernetes.store.module";
import {HeaderComponent} from "./header/header.component";
import {DummyService} from "./dummy/dummy.service";
import {ContextService} from "./shared/context.service";
import {LocalStorageModule} from 'angular-2-local-storage';
import {BsDropdownConfig, BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { OAuthService } from 'angular2-oauth2/oauth-service';
import {OnLogin} from "./shared/onlogin.service";

import { ENV_PROVIDERS } from './environment';
import { Broadcaster, Logger, Notifications } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { LoginService } from './shared/login.service';
import { witApiUrlProvider } from './shared/wit-api.provider';
import { authApiUrlProvider } from './shared/auth-api.provider';
import { ssoApiUrlProvider } from './shared/sso-api.provider';
import { TokenResolver } from './shared/token.resolver';

// Introduced to prevent the error that comes on click of build tab
// As fabric8-stack-analysis-ui NPM package that is put there uses this provider
import {Contexts} from 'ngx-fabric8-wit';

import { forgeApiUrlProvider } from './shared/forge-api.provider';
import { realmProvider } from './shared/realm.provider';

export function restangularProviderConfigurer(restangularProvider: any, config: ConfigService) {
  restangularProvider.setBaseUrl(config.getSettings().apiEndpoint);
}

@NgModule({
  imports: [
    BrowserModule,
    BsDropdownModule.forRoot(),
    FormsModule,
    HttpModule,
    RestangularModule.forRoot([ConfigService], restangularProviderConfigurer),
    NgbModule.forRoot(),
    Fabric8CommonModule,
    KubernetesStoreModule,
    KubernetesUIModule,
    LocalStorageModule.withConfig({
      prefix: 'fabric8',
      storageType: 'localStorage'
    }),
    // Load app routing last
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  providers: [
    BsDropdownConfig,
    ConfigService,
    Contexts,
    {
      provide: APP_INITIALIZER,
      useFactory: configServiceInitializer,
      deps: [ConfigService],
      multi: true,
    },
    authApiUrlProvider,
    ssoApiUrlProvider,
    witApiUrlProvider,
    realmProvider,
    AuthenticationService,
    Broadcaster,
    ContextService,
    LoginService,
    DummyService,
    ENV_PROVIDERS,
    forgeApiUrlProvider,
    Logger,
    OAuthService,
    OnLogin,
    TokenResolver,
    {
      provide: SpaceNamespace,
      useClass: SpaceNamespaceService,
    },
    {
      provide: Notifications,
      useClass: NoNotifications
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
