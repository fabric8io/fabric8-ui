import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TokensComponent } from './tokens.component';

const routes: Routes = [
  {
    path: '',
    component: TokensComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class TokensRoutingModule {}
