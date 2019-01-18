import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { User } from 'ngx-login-client';

import { CommentUI } from '../../models/comment';
import { WorkItem } from '../../models/work-item';
import { CollaboratorService } from '../../services/collaborator.service';
import { ModalService } from '../../services/modal.service';
import { WorkItemService } from './../../services/work-item.service';

@Component({
  selector: 'alm-work-item-comment',
  templateUrl: './work-item-comment.component.html',
  styleUrls: ['./work-item-comment.component.less'],
})
export class WorkItemCommentComponent implements OnInit, AfterViewInit {
  @Input() loadingComments: boolean = true;
  @Input() comments: CommentUI[];
  @Input() loggedIn: Boolean;
  @Input() loggedInUser: User;
  @Output() readonly create = new EventEmitter<CommentUI>();
  @Output() readonly update = new EventEmitter<CommentUI>();
  @Output() readonly delete = new EventEmitter<CommentUI>();

  isCollapsedComments: Boolean = false;
  commentEditable: Boolean = false;
  selectedCommentId: String = '';

  constructor(
    private workItemService: WorkItemService,
    private modalService: ModalService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    let commentbox = document.querySelector('#wi-comment-add-comment') as HTMLParagraphElement;
    if (!!commentbox) {
      commentbox.textContent = commentbox.dataset['placeholder'];
      commentbox.blur();
    }
  }

  openComment(id): void {
    if (this.loggedIn) {
      this.selectedCommentId = id;
      this.commentEditable = true;
    }
  }

  createComment(event): void {
    const rawText = event.rawText;
    const callBack = event.callBack;
    let newComment: CommentUI = {
      body: rawText,
    } as CommentUI;
    if (event.hasOwnProperty('parentId')) {
      newComment['parentId'] = event.parentId;
    }
    callBack('', '');
    this.create.emit(newComment);
  }

  createChildComment(newComment: CommentUI): void {
    this.create.emit(newComment);
  }

  showPreview(event: any): void {
    const rawText = event.rawText;
    const callBack = event.callBack;
    this.workItemService.renderMarkDown(rawText).subscribe((renderedHtml) => {
      callBack(rawText, this.sanitizer.bypassSecurityTrustHtml(renderedHtml));
    });
  }

  updateComment(comment: CommentUI): void {
    this.update.emit(comment);
  }

  onCommentEdit($event, inpId, saveBtnId) {
    this.preventDef($event);
    // console.log(document.getElementById(saveBtnId).cla);
    if (document.getElementById(inpId).innerHTML.trim() === '') {
      document.getElementById(saveBtnId).classList.add('disabled');
    } else {
      document.getElementById(saveBtnId).classList.remove('disabled');
    }
  }

  closeCommentEditing() {
    this.selectedCommentId = '';
  }

  resetCommentDraft(event: any = null): void {
    let commentbox = event.target,
      placeholder = event.target.dataset.placeholder;

    if (event.type === 'focus' && commentbox.textContent === placeholder) {
      commentbox.classList.remove('placeholder');
      commentbox.textContent = '';
    } else if (event.type === 'blur' && commentbox.textContent === '') {
      commentbox.classList.add('placeholder');
      commentbox.textContent = placeholder;
    }
  }

  preventDef(event: any) {
    event.preventDefault();
  }
}
