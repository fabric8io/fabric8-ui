import { AreaUI } from './../models/area.model';

export type AreaState = {
  [AreaId: string]: AreaUI;
};

export const initialState: AreaState = {} as AreaState;
