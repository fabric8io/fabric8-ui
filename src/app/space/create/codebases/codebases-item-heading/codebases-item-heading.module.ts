import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { NotificationModule } from 'patternfly-ng';

import { CodebasesItemHeadingComponent } from './codebases-item-heading.component';
import { WorkspacesNotificationModule } from '../workspaces-notification/workspaces-notification.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NotificationModule,
    TooltipModule.forRoot(),
    WorkspacesNotificationModule
  ],
  declarations: [ CodebasesItemHeadingComponent ],
  exports: [ CodebasesItemHeadingComponent ],
  providers: [TooltipConfig]
})
export class CodebasesItemHeadingModule {
  constructor(http: Http) {}
}
