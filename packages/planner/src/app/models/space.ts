import { Injectable } from '@angular/core';

// MemoizedSelector is needed even if it's not being used in this file
// Else you get this error
// Exported variable 'plannerSelector' has or is using name 'MemoizedSelector'
// from external module "@ngrx/store/src/selector" but cannot be named.
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
  select,
  Store,
} from '@ngrx/store';
import { Space } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import * as SpaceActions from './../actions/space.actions';
import { AppState, PlannerState } from './../states/app.state';

export const plannerSelector = createFeatureSelector<PlannerState>('planner');
export const spaceSelector = createSelector(
  plannerSelector,
  // TODO
  // This is a HACK till fabric8-ui removes the unnecessary planner imports
  // it should just be
  // state => state.space
  (state) => (state ? state.space : ({} as Space)),
);
@Injectable()
export class SpaceQuery {
  constructor(private store: Store<AppState>) {}

  get getCurrentSpace(): Observable<Space> {
    return this.store.pipe(
      select(spaceSelector),
      tap((s) => {
        if (!s) {
          this.store.dispatch(new SpaceActions.Get());
        }
      }),
      filter((s) => !!s),
    );
  }
}
