import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  BsDropdownConfig,
  BsDropdownModule,
  CollapseModule,
  TooltipConfig,
  TooltipModule,
} from 'ngx-bootstrap';
import { AuthenticationService } from 'ngx-login-client';

import { AlmEditableModule, AlmIconModule, MarkdownModule, WidgetsModule } from 'ngx-widgets';
import { SafePipeModule } from '../../pipes/safe.module';
import { ClickOutModule } from '../../widgets/clickout/clickout.module';
import { GlobalSettings } from './../../shared/globals';
import { CommentModule } from './../../widgets/comment-module/comment.module';
import { UserAvatarModule } from './../../widgets/user-avatar/user-avatar.module';
import { WorkItemCommentComponent } from './work-item-comment.component';

let providers = [GlobalSettings, TooltipConfig, BsDropdownConfig];

@NgModule({
  imports: [
    AlmEditableModule,
    AlmIconModule,
    ClickOutModule,
    CollapseModule,
    CommonModule,
    CommentModule,
    BsDropdownModule,
    FormsModule,
    MarkdownModule,
    RouterModule,
    TooltipModule,
    WidgetsModule,
    SafePipeModule,
    UserAvatarModule,
  ],
  declarations: [WorkItemCommentComponent],
  exports: [WorkItemCommentComponent],
  providers: providers,
})
export class WorkItemCommentModule {}
