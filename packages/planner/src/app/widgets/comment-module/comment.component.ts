import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommentUI } from './../../models/comment';
import { WorkItemService } from './../../services/work-item.service';

@Component({
  selector: 'fabric8-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.less'],
})
export class CommentComponent {
  /**
   * This is the comment input
   */
  @Input('comment') comment: CommentUI = null;

  /**
   * Event to show preview in markdown
   */
  @Output('onShowPreview') readonly onShowPreview: EventEmitter<{
    rawText: string;
    callBack: (x: string, y: string) => void;
  }> = new EventEmitter();

  /**
   * This output is emitted when new comment is added
   */
  @Output('onCreateRequest') readonly onCreateRequest: EventEmitter<CommentUI> = new EventEmitter();

  /**
   * This is an output event for any update request
   * to the comment or it's children
   */
  @Output('onUpdateRequest') readonly onUpdateRequest: EventEmitter<CommentUI> = new EventEmitter();

  private replyActive: boolean = false;

  constructor() {}

  showPreview(event: { rawText: string; callBack: (x: string, y: string) => void }): void {
    this.onShowPreview.emit(event);
  }

  createComment(event): void {
    const rawText = event.rawText;
    const callBack = event.callBack;
    callBack('', '');
    let newComment: CommentUI = {
      body: rawText,
      parentId: this.comment.id,
    } as CommentUI;
    this.onCreateRequest.emit(newComment);
  }

  updateComment(event: any, comment: CommentUI): void {
    const rawText = event.rawText;
    let updatedComment: CommentUI = {
      body: rawText,
      id: comment.id,
      selfLink: comment.selfLink,
    } as CommentUI;
    this.onUpdateRequest.emit(updatedComment);
  }

  updateChildComment(updatedComment: CommentUI) {
    this.onUpdateRequest.emit(updatedComment);
  }
}
