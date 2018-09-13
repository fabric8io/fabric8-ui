import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConnectedAccountsRoutingModule } from './connected-accounts-routing.module';
import { ConnectedAccountsComponent } from './connected-accounts.component';
@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    ConnectedAccountsRoutingModule
  ],
  declarations: [ConnectedAccountsComponent],
  exports: [ConnectedAccountsComponent]
})
export class ConnectedAccountsModule { }
