import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SlideOutPanelComponent } from './slide-out-panel.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SlideOutPanelComponent],
  exports: [SlideOutPanelComponent],
})
export class SlideOutPanelModule {}
