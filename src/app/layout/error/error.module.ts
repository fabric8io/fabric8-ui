import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { ErrorComponent } from './error.component';
import { ErrorRoutingModule } from './error-routing.module';

@NgModule({
  imports: [CommonModule, ErrorRoutingModule, HttpModule],
  declarations: [ErrorComponent]
})
export class ErrorModule {
  constructor(http: Http) {}
}
