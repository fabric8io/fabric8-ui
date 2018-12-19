import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [CommonModule, HomeRoutingModule, HttpModule],
  declarations: [HomeComponent],
})
export class HomeModule {
  constructor(http: Http) {}
}
