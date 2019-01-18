import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

//ngrx stuff
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CommentEffects } from './../../effects/comment.effects';
import { CommentReducer } from './../../reducers/comment.reducer';
import { CommentState, initialState as initialCommentState } from './../../states/comment.state';
import { WorkItemCommentModule } from './../work-item-comment/work-item-comment.module';
import { WorkItemCommentWrapperComponent } from './work-item-comment-wrapper.component';

@NgModule({
  imports: [CommonModule, WorkItemCommentModule],
  declarations: [WorkItemCommentWrapperComponent],
  exports: [WorkItemCommentWrapperComponent],
})
export class WorkItemCommentWrapperModule {}
