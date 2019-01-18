import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WorkItemDetailModule } from './../work-item-detail/work-item-detail.module';
import { WorkItemPreviewPanelComponent } from './work-item-preview-panel.component';

@NgModule({
  imports: [CommonModule, WorkItemDetailModule],
  declarations: [WorkItemPreviewPanelComponent],
  exports: [WorkItemPreviewPanelComponent],
})
export class WorkItemPreviewPanelModule {}
