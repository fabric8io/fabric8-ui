import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WidgetsModule } from 'ngx-widgets';
import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { NgArrayPipesModule } from 'angular-pipes';

import { ConnectedAccountsComponent } from './connected-accounts.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    WidgetsModule,
    NgArrayPipesModule,
    Fabric8WitModule
  ],
  declarations: [ConnectedAccountsComponent],
  exports: [ConnectedAccountsComponent]
})
export class ConnectedAccountsModule { }
