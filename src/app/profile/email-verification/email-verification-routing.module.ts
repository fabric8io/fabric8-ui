import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailVerificationComponent } from './email-verification.component';

const routes: Routes = [
  {
    path: '',
    component: EmailVerificationComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class EmailVerificationRoutingModule {}
