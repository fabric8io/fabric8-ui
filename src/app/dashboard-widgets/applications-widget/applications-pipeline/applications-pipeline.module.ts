import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApplicationsPipelineComponent } from './applications-pipeline.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ApplicationsPipelineComponent],
  exports: [ApplicationsPipelineComponent]
})
export class ApplicationsPipelineModule { }
