import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { EmailVerificationRoutingModule } from './email-verification-routing.module';
import { EmailVerificationComponent } from './email-verification.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    EmailVerificationRoutingModule
  ],
  declarations: [ EmailVerificationComponent ]
})
export class EmailVerificationModule {}
