import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantComponent } from './tenant.component';

const routes: Routes = [
  {
    path: '',
    component: TenantComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenantRoutingModule {}
