import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ngx-bootstrap';
import { TooltipModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-modal';
import { CustomQueryModule } from './../custom-query-panel/custom-query-panel.module';
import { GroupTypesModule } from './../group-types-panel/group-types-panel.module';
import { SidepanelComponent } from './side-panel.component';

// ngrx stuff
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { IterationEffects } from './../../effects/iteration.effects';
import { iterationReducer } from './../../reducers/iteration-reducer';
import {
  initialState as initialIterationState,
  IterationState,
} from './../../states/iteration.state';

@NgModule({
  imports: [
    CollapseModule,
    CommonModule,
    CustomQueryModule,
    GroupTypesModule,
    ModalModule,
    RouterModule,
    TooltipModule,
  ],
  declarations: [SidepanelComponent],
  exports: [SidepanelComponent],
})
export class SidepanelModule {}
