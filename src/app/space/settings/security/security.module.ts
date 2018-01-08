import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { SecurityRoutingModule } from './security-routing.module';
import { SecurityComponent } from './security.component';

@NgModule({
  imports:      [ CommonModule, SecurityRoutingModule ],
  declarations: [ SecurityComponent ]
})
export class SecurityModule {
  constructor(http: Http) {}
}
