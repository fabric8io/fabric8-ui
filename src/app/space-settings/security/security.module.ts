import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { Http } from '@angular/http';

import { SecurityComponent }     from './security.component';
import { SecurityRoutingModule } from './security-routing.module';

@NgModule({
  imports:      [ CommonModule, SecurityRoutingModule ],
  declarations: [ SecurityComponent ],
})
export class SecurityModule {
  constructor(http: Http) {}
}
