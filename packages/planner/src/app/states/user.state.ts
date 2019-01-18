import { UserUI } from './../models/user';

export type UserState = {
  [userId: string]: UserUI;
};

export const initialState: UserState = {};
