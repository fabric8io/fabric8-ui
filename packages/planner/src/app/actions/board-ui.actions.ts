import { Action } from '@ngrx/store';
import { BoardState } from '../states/board.state';

export const LOCK_BOARD = '[board-ui] Lock';
export const UNLOCK_BOARD = '[board-ui] Unlock';

export class LockBoard implements Action {
  readonly type = LOCK_BOARD;
}

export class UnlockBoard implements Action {
  readonly type = UNLOCK_BOARD;
}

export type All = LockBoard | UnlockBoard;
