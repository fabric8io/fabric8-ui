import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatureFooterComponent } from './feature-footer.component';

import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
@NgModule({
  imports: [
    CommonModule,
    TooltipModule
  ],
  declarations: [
    FeatureFooterComponent
  ],
  exports: [
    FeatureFooterComponent
  ],
  providers: [TooltipConfig]
})
export class FeatureFooterModule { }
