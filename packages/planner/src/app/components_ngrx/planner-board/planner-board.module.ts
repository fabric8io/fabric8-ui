import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap';
import { BoardEffects } from './../../effects/board.effect';
import {
  BoardReducer,
  BoardUIReducer,
  ColumnWorkItemReducer,
} from './../../reducers/index.reducer';
import { BoardService } from './../../services/board.service';
import {
  InitialBoardState,
  InitialBoardUIState,
  InitialColumnWorkItemState,
} from './../../states/index.state';

import { PlannerLayoutModule } from './../../widgets/planner-layout/planner-layout.module';
import { PlannerBoardColumnModule } from './../planner-board-column/planner-board-column.module';
import { PlannerCardModule } from './../planner-card/planner-card.module';
import { SidepanelModule } from './../side-panel/side-panel.module';
import { WorkItemPreviewPanelModule } from './../work-item-preview-panel/work-item-preview-panel.module';
import { PlannerBoardRoutingModule } from './planner-board-routing.module';
import { PlannerBoardComponent } from './planner-board.component';

// Data Querries
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { ErrorHandler } from '../../effects/work-item-utils';
import { AreaQuery } from '../../models/area.model';
import { BoardQuery, BoardUIQuery, ColumnWorkItemQuery } from '../../models/board.model';
import { GroupTypeQuery } from '../../models/group-types.model';
import { IterationQuery } from '../../models/iteration.model';
import { LabelQuery } from '../../models/label.model';
import { PlannerModalModule } from '../../widgets/modal/modal.module';
import { CommentQuery } from './../../models/comment';
import { SpaceQuery } from './../../models/space';
import { UserQuery } from './../../models/user';
import { WorkItemQuery } from './../../models/work-item';
import { F8SortByPipeModule } from './../../pipes/sort-by.module';
import { FeatureFlagModule } from 'ngx-feature-flag';

@NgModule({
  providers: [
    DragulaService,
    TooltipConfig,
    BoardService,
    CommentQuery,
    UserQuery,
    LabelQuery,
    IterationQuery,
    WorkItemQuery,
    AreaQuery,
    SpaceQuery,
    GroupTypeQuery,
    BoardQuery,
    BoardUIQuery,
    ColumnWorkItemQuery,
    ErrorHandler,
  ],
  imports: [
    CommonModule,
    DragulaModule,
    F8SortByPipeModule,
    PlannerBoardRoutingModule,
    PlannerBoardColumnModule,
    PlannerCardModule,
    PlannerLayoutModule,
    PlannerModalModule,
    WorkItemPreviewPanelModule,
    SidepanelModule,
    FeatureFlagModule,
    TooltipModule.forRoot(),
    StoreModule.forFeature(
      'boardView',
      {
        boards: BoardReducer,
        columnWorkItem: ColumnWorkItemReducer,
        boardUi: BoardUIReducer,
      },
      {
        initialState: {
          boards: InitialBoardState,
          columnWorkItem: InitialColumnWorkItemState,
          boardUi: InitialBoardUIState,
        },
      },
    ),
    EffectsModule.forFeature([BoardEffects]),
  ],
  declarations: [PlannerBoardComponent],
  exports: [PlannerBoardComponent],
})
export class PlannerBoardModule {}
