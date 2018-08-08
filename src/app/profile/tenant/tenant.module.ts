import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { RemainingCharsCountModule } from 'patternfly-ng/remaining-chars-count';

import { TenantRoutingModule } from './tenant-routing.module';
import { TenantComponent } from './tenant.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    JWBootstrapSwitchModule,
    RemainingCharsCountModule,
    TenantRoutingModule
  ],
  declarations: [ TenantComponent ]
})
export class TenantModule {}
