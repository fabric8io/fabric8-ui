import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgArrayPipesModule } from 'angular-pipes';
import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { WidgetsModule } from 'ngx-widgets';

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
