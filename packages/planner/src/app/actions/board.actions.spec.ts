import { boardUIData } from '../services/board.snapshot';
import { BoardState } from './../states/board.state';
import * as BoardActions from './board.actions';

describe('Unit Test :: Board Actions', () => {
  it('GetBoard :: should create get action', () => {
    const action = new BoardActions.Get();
    expect({ ...action }).toEqual({
      type: BoardActions.GET,
    });
  });

  it('GetBoardSuccess :: should create get success action', () => {
    const boards = {
      'board-1': boardUIData,
    } as BoardState;

    const action = new BoardActions.GetSuccess(boards);
    expect({ ...action }).toEqual({
      type: BoardActions.GET_SUCCESS,
      payload: boards,
    });
  });

  it('GetBoardError :: should create get error action', () => {
    const action = new BoardActions.GetError();
    expect({ ...action }).toEqual({ type: BoardActions.GET_ERROR });
  });
});
