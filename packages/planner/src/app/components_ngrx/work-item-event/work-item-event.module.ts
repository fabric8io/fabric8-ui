import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap';
import { AlmEditableModule, AlmIconModule, MarkdownModule, WidgetsModule } from 'ngx-widgets';
import { LabelsModule } from '../labels/labels.module';
import { F8TimePipeModule } from './../../pipes/f8-time.module';
import { UserAvatarModule } from './../../widgets/user-avatar/user-avatar.module';
import { WorkItemEventComponent } from './work-item-event.component';

@NgModule({
  imports: [
    AlmEditableModule,
    AlmIconModule,
    WidgetsModule,
    LabelsModule,
    MarkdownModule,
    CommonModule,
    TooltipModule,
    F8TimePipeModule,
    UserAvatarModule,
  ],
  declarations: [WorkItemEventComponent],
  exports: [WorkItemEventComponent],
  providers: [TooltipConfig],
})
export class WorkItemEventModule {}
