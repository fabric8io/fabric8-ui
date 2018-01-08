import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';

import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './error.component';

@NgModule({
  imports: [CommonModule, ErrorRoutingModule, HttpModule],
  declarations: [ErrorComponent]
})
export class ErrorModule {
  constructor(http: Http) {}
}
