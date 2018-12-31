import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CollapseModule } from 'ngx-bootstrap';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { InfotipModule } from '../infotip/infotip.module';

import { MyDatePickerModule } from 'mydatepicker';
import { DragulaModule } from 'ng2-dragula';
import { TruncateModule } from 'ng2-truncate';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-modal';
import { WidgetsModule } from 'ngx-widgets';
import { IterationService } from '../../services/iteration.service';
import { IterationListEntryComponent } from '../iteration-list-entry/iteration-list-entry.component';
import { IterationTreeComponent } from '../iteration-tree/iteration-tree.component';
import { FabPlannerIterationModalComponent } from '../iterations-modal/iterations-modal.component';
import { SwitchModule } from './../../widgets/switch/switch.module';
import { IterationComponent } from './iterations-panel.component';
import { AutofocusModule } from 'ngx-widgets';

// ngrx stuff
import { StoreModule } from '@ngrx/store';
import { IterationQuery } from '../../models/iteration.model';
import { iterationUiReducer } from './../../reducers/iteration-reducer';
import { initialUIState } from './../../states/iteration.state';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CollapseModule,
    CommonModule,
    DragulaModule,
    FormsModule,
    MyDatePickerModule,
    ModalModule,
    TooltipModule.forRoot(),
    TruncateModule,
    SwitchModule,
    WidgetsModule,
    RouterModule,
    InfotipModule,
    AutofocusModule,
    StoreModule.forFeature(
      'iterationPanel',
      {
        iterationUI: iterationUiReducer,
      },
      {
        initialState: {
          iterationUI: initialUIState,
        },
      },
    ),
  ],
  declarations: [
    FabPlannerIterationModalComponent,
    IterationComponent,
    IterationListEntryComponent,
    IterationTreeComponent,
  ],
  exports: [IterationComponent],
  providers: [BsDropdownConfig, IterationService, TooltipConfig, IterationQuery],
})
export class IterationModule {}
