import { BoardModelUI } from '../models/board.model';

export type BoardState = {
  [id: string]: BoardModelUI;
};

export const initialState: BoardState = {} as BoardState;
