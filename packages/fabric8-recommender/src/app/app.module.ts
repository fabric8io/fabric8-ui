import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Broadcaster } from 'ngx-base';
import { Contexts,  WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, AUTH_API_URL, SSO_API_URL } from 'ngx-login-client';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { witApiUrlProvider } from './shared/wit-api.provider';
import { ApiLocatorService } from './shared/api-locator.service';
import { authApiUrlProvider } from './shared/auth-api.provider';
import { ssoApiUrlProvider } from './shared/sso-api.provider';
import { realmProvider } from './shared/realm-token.provider';
import { MockAuthenticationService } from './shared/mock-auth.service';

// Imports stackdetailsmodule
import { StackDetailsModule } from '../../projects/fabric8-stack-analysis-ui/src/lib/stack/stack-details/stack-details.module';
import { StackReportInShortModule } from '../../projects/fabric8-stack-analysis-ui/src/lib/stack/stack-report-inshort/stack-report-inshort.module';
// import { StackDetailsModule } from './stack/stack-details/stack-details.module';
// import { StackReportInShortModule } from './stack/stack-report-inshort/stack-report-inshort.module';

import { AppRoutingModule } from './app.routing';

import { CommonService } from '../../projects/fabric8-stack-analysis-ui/src/lib/stack/utils/common.service';
import { StackAnalysesService } from '../../projects/fabric8-stack-analysis-ui/src/lib/stack/stack-analyses.service';
import { AddWorkFlowService } from '../../projects/fabric8-stack-analysis-ui/src/lib/stack/stack-details/add-work-flow.service';
import { ComponentFeedbackService } from '../../projects/fabric8-stack-analysis-ui/src/lib/stack/utils/component-feedback/component-feedback.service';

@NgModule({
  imports: [
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    StackDetailsModule,
    FormsModule,
    StackReportInShortModule
  ],
  declarations: [ AppComponent ],
  providers: [
    Broadcaster,
    ApiLocatorService,
    CommonService,
    witApiUrlProvider,
    authApiUrlProvider,
    ssoApiUrlProvider,
    realmProvider,
    {
      provide: AuthenticationService, useClass: MockAuthenticationService
    },
    { provide: StackAnalysesService, useClass: StackAnalysesService, deps: [HttpClient, AuthenticationService]},
    { provide: AddWorkFlowService, useClass: AddWorkFlowService, deps: [HttpClient, AuthenticationService, WIT_API_URL, Contexts]},
    { provide: ComponentFeedbackService, useClass: ComponentFeedbackService, deps: [HttpClient, AuthenticationService]},
    Contexts
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
