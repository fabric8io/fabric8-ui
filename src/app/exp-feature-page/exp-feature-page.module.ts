import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { ExpFeaturePageComponent } from './exp-feature-page.component';
import { ExpFeaturePageRoutingModule } from './exp-feature-page-routing.module';

@NgModule({
  imports: [CommonModule, ExpFeaturePageRoutingModule, HttpModule],
  declarations: [ExpFeaturePageComponent]
})
export class ExpFeaturePageModule {
  constructor(http: Http) {}
}