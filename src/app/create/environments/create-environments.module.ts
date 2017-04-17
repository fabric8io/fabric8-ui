import { Fabric8UISpaceNamespace } from './../../shared/runtime-console/fabric8-ui-space-namespace.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';
import { EnvironmentModule, SpaceNamespace } from 'fabric8-runtime-console';


@NgModule({
  imports: [CommonModule, EnvironmentModule],
  providers: [
    {
      provide: SpaceNamespace,
      useClass: Fabric8UISpaceNamespace
    }
  ]
})
export class CreateEnvironmentsModule {
  constructor(http: Http) { }
}
