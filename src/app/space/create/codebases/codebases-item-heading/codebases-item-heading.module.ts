import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { WorkspacesNotificationModule } from '../workspaces-notification/workspaces-notification.module';
import { CodebasesItemHeadingComponent } from './codebases-item-heading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
    WorkspacesNotificationModule
  ],
  declarations: [ CodebasesItemHeadingComponent ],
  exports: [ CodebasesItemHeadingComponent ],
  providers: [TooltipConfig]
})
export class CodebasesItemHeadingModule {}
