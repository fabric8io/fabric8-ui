import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectedAccountsComponent } from './connected-accounts.component';

const routes: Routes = [
  {
    path: '',
    component: ConnectedAccountsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectedAccountsRoutingModule {}
