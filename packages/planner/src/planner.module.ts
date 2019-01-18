import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PlannerBoardModule } from './app/components_ngrx/planner-board/planner-board.module';
import { PlannerListModule } from './app/components_ngrx/planner-list/planner-list.module';
import { PlannerQueryModule } from './app/components_ngrx/planner-query/planner-query.module';
import { WorkItemDetailExternalModule } from './app/components_ngrx/work-item-detail/work-item-detail-external.module';

// ngrx stuff
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as effects from './app/effects/index.effects';
import * as reducers from './app/reducers/index.reducer';
import * as states from './app/states/index.state';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '**',
        redirectTo: '/_error',
      },
    ]),
  ],
  exports: [RouterModule],
})
export class PlannerRoutingModule {}

@NgModule({
  imports: [
    // The order is important
    StoreModule.forFeature(
      'planner',
      {
        space: reducers.SpaceReducer,
        labels: reducers.LabelReducer,
        iterations: reducers.iterationReducer,
        areas: reducers.AreaReducer,
        collaborators: reducers.CollaboratorReducer,
        users: reducers.UserReducer,
        customQueries: reducers.CustomQueryReducer,
        groupTypes: reducers.GroupTypeReducer,
        workItemTypes: reducers.WorkItemTypeReducer,
        workItems: reducers.WorkItemReducer,
        workItemStates: reducers.WorkItemStateReducer,
        infotips: reducers.InfotipReducer,
      },
      {
        initialState: {
          space: states.initialSpaceState,
          labels: states.initialLabelState,
          iterations: states.initialIterationState,
          areas: states.initialAreaState,
          collaborators: states.initialCollaboratorState,
          users: states.inititalUserState,
          customQueries: states.initialCustomQueryState,
          groupTypes: states.initialGroupTypeState,
          workItemTypes: states.initialWorkItemTypeState,
          workItems: states.initialWorkItemState,
          workItemStates: states.initialWIState,
          infotips: states.initialInfotipState,
        },
      },
    ),
    EffectsModule.forFeature([
      effects.SpaceEffects,
      effects.LabelEffects,
      effects.IterationEffects,
      effects.AreaEffects,
      effects.CollaboratorEffects,
      effects.UserEffects,
      effects.CustomQueryEffects,
      effects.GroupTypeEffects,
      effects.WorkItemTypeEffects,
      effects.WorkItemEffects,
      effects.InfotipEffects,
    ]),
    PlannerBoardModule,
    PlannerQueryModule,
    WorkItemDetailExternalModule,
    PlannerListModule,
    PlannerRoutingModule,
  ],
})
export class PlannerModule {}
