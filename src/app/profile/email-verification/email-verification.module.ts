import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmailVerificationRoutingModule } from './email-verification-routing.module';
import { EmailVerificationComponent } from './email-verification.component';

@NgModule({
  imports: [
    CommonModule,
    EmailVerificationRoutingModule
  ],
  declarations: [ EmailVerificationComponent ]
})
export class EmailVerificationModule {}
