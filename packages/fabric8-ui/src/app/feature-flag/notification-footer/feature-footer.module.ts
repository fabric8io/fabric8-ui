import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { FeatureFooterComponent } from './feature-footer.component';

@NgModule({
  imports: [CommonModule, TooltipModule],
  declarations: [FeatureFooterComponent],
  exports: [FeatureFooterComponent],
  providers: [TooltipConfig],
})
export class FeatureFooterModule {}
