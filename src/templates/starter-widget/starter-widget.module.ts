import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StarterWidgetComponent } from './starter-widget.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [StarterWidgetComponent],
  exports: [StarterWidgetComponent]
})
export class StarterWidgetModule { }
