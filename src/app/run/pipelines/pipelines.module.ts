import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { PipelinesComponent }     from './pipelines.component';
import { PipelinesRoutingModule } from './pipelines-routing.module';
import { SpaceModule } from 'fabric8-runtime-console';
import { RestangularModule } from 'ng2-restangular';
import { KubernetesRestangularModule } from 'fabric8-runtime-console/src/app/kubernetes/service/kubernetes.restangular';
import { LoginService } from 'fabric8-runtime-console/src/app/shared/login.service';
import { OnLogin } from 'fabric8-runtime-console/src/app/shared/onlogin.service';
import { OAuthConfigStore } from 'fabric8-runtime-console/src/app/kubernetes/store/oauth-config-store';

@NgModule({
  imports:      [ CommonModule,
    PipelinesRoutingModule,
    RestangularModule,
    KubernetesRestangularModule,
    HttpModule,
    SpaceModule ],
  declarations: [ PipelinesComponent ],
  providers: [ LoginService, OnLogin, OAuthConfigStore ]
})
export class PipelinesModule {
  constructor(http: Http) {}
}
