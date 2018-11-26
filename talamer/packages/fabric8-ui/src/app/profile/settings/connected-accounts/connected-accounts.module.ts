import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap';
import { ConnectedAccountsRoutingModule } from './connected-accounts-routing.module';
import { ConnectedAccountsComponent } from './connected-accounts.component';

import { TenantService } from '../../services/tenant.service';
@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    ConnectedAccountsRoutingModule,
    TooltipModule.forRoot()
  ],
  declarations: [ConnectedAccountsComponent],
  providers: [TenantService],
  exports: [ConnectedAccountsComponent]
})
export class ConnectedAccountsModule { }
