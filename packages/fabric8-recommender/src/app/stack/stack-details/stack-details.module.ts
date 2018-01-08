import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-modal';
import { TabsModule, AccordionModule } from 'ngx-bootstrap';

import { GlobalConstants } from '../constants/constants.service';
import { StackDetailsComponent } from './stack-details.component';

/** New UX */
// import {StackLevelModule} from '../stack-level/stack-level.module';
// import {ComponentLevelModule} from '../component-level/component-level.module';
import { FeedbackModule } from '../feedback/feedback.module';
/** New UX */


/** Stack Report Revamp - Latest */
import { ReportSummaryModule } from '../report-summary/report-summary.module';
import { CardDetailsModule } from '../card-details/card-details.module';
/** Stack Report Revamp - Latest */

const revampImports = [
  ReportSummaryModule,
  CardDetailsModule
];

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ModalModule,
    // StackLevelModule,
    // ComponentLevelModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    ...revampImports
  ],
  declarations: [
    StackDetailsComponent
  ],
  exports: [
    StackDetailsComponent
  ],
  providers: [
    GlobalConstants
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StackDetailsModule {
  constructor() {}
}
