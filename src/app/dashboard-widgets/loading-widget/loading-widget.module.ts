import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LoadingWidgetComponent } from './loading-widget.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [LoadingWidgetComponent],
  exports: [LoadingWidgetComponent]
})
export class LoadingWidgetModule { }
