import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';

import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { RemainingCharsCountModule } from 'patternfly-ng';

import { TenantRoutingModule } from './tenant-routing.module';
import { TenantComponent } from './tenant.component';

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
