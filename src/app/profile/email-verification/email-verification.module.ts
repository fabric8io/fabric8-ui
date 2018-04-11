import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';

import { EmailVerificationRoutingModule } from './email-verification-routing.module';
import { EmailVerificationComponent } from './email-verification.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    EmailVerificationRoutingModule
  ],
  declarations: [ EmailVerificationComponent ]
})
export class EmailVerificationModule {
  constructor(http: Http) {}
}
