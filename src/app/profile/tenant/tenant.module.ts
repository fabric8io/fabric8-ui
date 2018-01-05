import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';

import { RemainingCharsCountModule } from 'patternfly-ng';

import { TenantComponent } from './tenant.component';
import { TenantRoutingModule } from "./tenant-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    JWBootstrapSwitchModule,
    RemainingCharsCountModule,
    TenantRoutingModule
  ],
  declarations: [ TenantComponent ]
})
export class TenantModule {
  constructor(http: Http) {}
}
