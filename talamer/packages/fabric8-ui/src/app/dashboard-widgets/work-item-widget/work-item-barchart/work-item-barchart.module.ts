import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WorkItemBarchartComponent } from './work-item-barchart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [WorkItemBarchartComponent],
  exports: [WorkItemBarchartComponent]
})
export class WorkItemBarchartModule { }
