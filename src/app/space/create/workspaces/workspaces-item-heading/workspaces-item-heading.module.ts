import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { NotificationModule } from 'patternfly-ng';

import { WorkspacesNotificationModule } from '../../codebases/workspaces-notification/workspaces-notification.module';
import { WorkspacesItemHeadingComponent } from './workspaces-item-heading.component';

@NgModule({
  imports: [
    CommonModule,
    NotificationModule,
    WorkspacesNotificationModule
  ],
  declarations: [ WorkspacesItemHeadingComponent ],
  exports: [ WorkspacesItemHeadingComponent ]
})
export class WorkspacesItemHeadingModule {
  constructor(http: Http) { }
}
