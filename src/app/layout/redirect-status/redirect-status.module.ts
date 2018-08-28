import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RedirectStatusRoutingModule } from './redirect-status-routing.module';
import { RedirectStatusComponent } from './redirect-status.component';

import { StatusComponent } from './status/status.component';

@NgModule({
  imports: [
    CommonModule,
    RedirectStatusRoutingModule
  ],
  declarations: [ StatusComponent, RedirectStatusComponent ]
})
export class RedirectStatusModule {}
