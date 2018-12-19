import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { MarkdownModule, WidgetsModule } from 'ngx-widgets';

import { SafePipeModule } from '../../pipes/safe.module';
import { CommentComponent } from './comment.component';

import { UserAvatarModule } from './../../widgets/user-avatar/user-avatar.module';

@NgModule({
  declarations: [CommentComponent],
  imports: [
    CommonModule,
    SafePipeModule,
    MarkdownModule,
    TooltipModule,
    WidgetsModule,
    UserAvatarModule,
  ],
  exports: [CommentComponent],
})
export class CommentModule {}
