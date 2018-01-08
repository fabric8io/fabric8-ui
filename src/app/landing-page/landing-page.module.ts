import { CommonModule } from '@angular/common';
import { NgModule }     from '@angular/core';
import { Http }         from '@angular/http';

import { LandingPageRoutingModule }   from './landing-page-routing.module';
import { LandingPageComponent }   from './landing-page.component';

@NgModule({
  imports:      [ CommonModule, LandingPageRoutingModule ],
  declarations: [ LandingPageComponent ]
})
export class LandingPageModule {
  constructor(http: Http) {}
}
