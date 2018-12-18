import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';

import { SlideOutPanelModule } from '../slide-out-panel.module';
import { SlideOutExampleRoutingModule } from './slide-out-example-routing.module';
import { SlideOutExampleComponent } from './slide-out-example.component';

@NgModule({
  imports: [CommonModule, HttpModule, SlideOutExampleRoutingModule, SlideOutPanelModule],
  declarations: [SlideOutExampleComponent],
})
export class SlideOutExampleModule {
  constructor(http: Http) {}
}
