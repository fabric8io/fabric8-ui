import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BoardMapper } from '../models/board.model';
import { normalizeArray } from '../models/common.model';
import { SpaceQuery } from '../models/space';
import { BoardService } from '../services/board.service';
import * as BoardActions from './../actions/board.actions';
import { ErrorHandler, filterTypeWithSpace } from './work-item-utils';

export type Action = BoardActions.All;

@Injectable()
export class BoardEffects {
  constructor(
    private actions$: Actions,
    private boardService: BoardService,
    private errhandler: ErrorHandler,
    private spaceQuery: SpaceQuery,
  ) {}

  @Effect() getBoards: Observable<Action> = this.actions$.pipe(
    filterTypeWithSpace(BoardActions.GET, this.spaceQuery.getCurrentSpace),
    switchMap(([action, space]) => {
      const spaceTemplateUrl = space.relationships['space-template'].links.related;
      return this.boardService.getBoardApiUrl(spaceTemplateUrl);
    }),
    switchMap((url) => {
      return this.boardService.getBoards(url).pipe(
        map((boards) => {
          const boardmapper = new BoardMapper();
          const included = normalizeArray(boards.included);
          return boards.data.map((board) => {
            board.relationships.columns.data = board.relationships.columns.data.map((col) => {
              return included[col.id];
            });
            return boardmapper.toUIModel(board);
          });
        }),
        map((boards) => new BoardActions.GetSuccess(normalizeArray(boards, 'context'))),
        catchError((err) =>
          this.errhandler.handleError<Action>(
            err,
            'Problem in loading Boards',
            new BoardActions.GetError(),
          ),
        ),
      );
    }),
  );
}
