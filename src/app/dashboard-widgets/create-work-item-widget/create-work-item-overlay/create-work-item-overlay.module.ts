import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { WorkItemDetailAddTypeSelectorModule } from 'fabric8-planner';

import { CreateWorkItemOverlayComponent } from './create-work-item-overlay.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WorkItemDetailAddTypeSelectorModule
  ],
  declarations: [CreateWorkItemOverlayComponent],
  exports: [CreateWorkItemOverlayComponent]
})
export class CreateWorkItemOverlayModule { }
