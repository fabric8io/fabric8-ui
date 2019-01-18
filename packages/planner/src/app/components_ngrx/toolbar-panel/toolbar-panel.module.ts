import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { ToolbarModule } from 'patternfly-ng/toolbar';

import { CollaboratorService } from '../../services/collaborator.service';
import { FilterService } from '../../services/filter.service';
import { WorkItemService } from '../../services/work-item.service';
import { ToolbarPanelComponent } from './toolbar-panel.component';

import { AlmEditableModule, AlmIconModule, WidgetsModule } from 'ngx-widgets';

//ngrx stuff
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AreaQuery } from '../../models/area.model';
import { IterationQuery } from '../../models/iteration.model';
import { WorkItemTypeQuery } from '../../models/work-item-type';
import { FilterEffects } from './../../effects/filter.effects';
import { GroupTypeQuery } from './../../models/group-types.model';
import { SpaceQuery } from './../../models/space';
import { FilterReducer } from './../../reducers/filter.reducer';
import { initialState as initialFilterState } from './../../states/filter.state';
import { ExportCsvModule } from '../export-csv/export-csv.module';

@NgModule({
  imports: [
    AlmEditableModule,
    AlmIconModule,
    BsDropdownModule,
    CommonModule,
    ExportCsvModule,
    ToolbarModule,
    TooltipModule.forRoot(),
    WidgetsModule,
    StoreModule.forFeature(
      'toolbar',
      {
        filters: FilterReducer,
      },
      {
        initialState: {
          filters: initialFilterState,
        },
      },
    ),
    EffectsModule.forFeature([FilterEffects]),
  ],
  declarations: [ToolbarPanelComponent],
  providers: [
    BsDropdownConfig,
    CollaboratorService,
    FilterService,
    TooltipConfig,
    WorkItemService,
    IterationQuery,
    AreaQuery,
    WorkItemTypeQuery,
    GroupTypeQuery,
    SpaceQuery,
  ],
  exports: [ToolbarPanelComponent],
})
export class ToolbarPanelModule {}
