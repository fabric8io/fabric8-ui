import { EntityState } from '@ngrx/entity';
import { LabelUI } from './../models/label.model';

export interface LabelState extends EntityState<LabelUI> {}

export const initialState = {
  ids: [],
  entities: {},
};
