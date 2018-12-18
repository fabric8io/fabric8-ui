import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Notification, Notifications, NotificationType } from 'ngx-base';
import { Observable, pipe } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as CommentActions from './../actions/comment.actions';
import { CommentMapper, CommentService, CommentUI } from './../models/comment';
import { UserMapper } from './../models/user';
import { WorkItemService } from './../services/work-item.service';
import { AppState } from './../states/app.state';
import { CommentState } from './../states/comment.state';
import { ErrorHandler } from './work-item-utils';

export type Action = CommentActions.All;

@Injectable()
export class CommentEffects {
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService,
    private errHandler: ErrorHandler,
  ) {}
  private commentMapper: CommentMapper = new CommentMapper();

  @Effect() getWorkItemComments$: Observable<Action> = this.actions$.pipe(
    ofType<CommentActions.Get>(CommentActions.GET),
    switchMap((action) => {
      const payload = action.payload;
      return this.workItemService.resolveComments(payload).pipe(
        map((comments) => {
          return comments.data.map((comment) => {
            return this.commentMapper.toUIModel(comment);
          });
        }),
        map((comments: CommentUI[]) => {
          return new CommentActions.GetSuccess(comments);
        }),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            `Problem in fetching Comments.`,
            new CommentActions.GetError(),
          ),
        ),
      );
    }),
  );

  @Effect() addComment$: Observable<Action> = this.actions$.pipe(
    ofType<CommentActions.Add>(CommentActions.ADD),
    switchMap((data) => {
      return this.workItemService.createComment(data.payload.url, data.payload.comment).pipe(
        map((comment) => {
          return new CommentActions.AddSuccess(this.commentMapper.toUIModel(comment));
        }),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            `Problem in add comment.`,
            new CommentActions.AddError(),
          ),
        ),
      );
    }),
  );

  @Effect() updateComment$: Observable<Action> = this.actions$.pipe(
    ofType<CommentActions.Update>(CommentActions.UPDATE),
    switchMap((action) => {
      const comment = action.payload;
      return this.workItemService.updateComment(comment).pipe(
        map((comment: CommentService) => {
          return new CommentActions.UpdateSuccess(this.commentMapper.toUIModel(comment));
        }),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            `Problem in Update comment.`,
            new CommentActions.UpdateError(),
          ),
        ),
      );
    }),
  );

  @Effect() deleteComment$: Observable<Action> = this.actions$.pipe(
    ofType<CommentActions.Delete>(CommentActions.DELETE),
    map((action) => action.payload),
    switchMap((payload) => {
      const comment = this.commentMapper.toServiceModel(payload);
      return this.workItemService.deleteComment(comment).pipe(
        map(() => {
          return new CommentActions.DeleteSuccess(payload);
        }),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            `Problem in Delete comment.`,
            new CommentActions.DeleteError(),
          ),
        ),
      );
    }),
  );
}
