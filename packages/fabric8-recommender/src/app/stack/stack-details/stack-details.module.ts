import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { StackDetailsComponent } from './stack-details.component';
import { ModalModule } from 'ngx-modal';

import { RecommenderModule } from '../recommender/recommender.module';
import { StackComponentsModule } from '../stack-components/stack-components.module';
import { OverviewModule } from '../overview/overview.module';

import { GlobalConstants } from '../constants/constants.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    ModalModule,
    RecommenderModule,
    StackComponentsModule,
    OverviewModule
  ],
  declarations: [ StackDetailsComponent ],
  exports: [ StackDetailsComponent ],
  providers: [ GlobalConstants ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StackDetailsModule {
  constructor() {}
}
