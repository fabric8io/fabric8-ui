import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-modal';
import { TabsModule, AccordionModule } from 'ngx-bootstrap';

import { GlobalConstants } from '../constants/constants.service';
import { StackDetailsComponent } from './stack-details.component';

/** New UX */
// import {StackLevelModule} from '../stack-level/stack-level.module';
// import {ComponentLevelModule} from '../component-level/component-level.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { PipelineInsightsModule } from '../pipeline-insights/pipeline-insights.module';
/** New UX */


/** Stack Report Revamp - Latest */
import { ReportSummaryModule } from '../report-summary/report-summary.module';
import { CardDetailsModule } from '../card-details/card-details.module';
import { CommonService } from '../utils/common.service';
/** Stack Report Revamp - Latest */

const revampImports = [
  ReportSummaryModule,
  CardDetailsModule
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ModalModule,
    PipelineInsightsModule,
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
    GlobalConstants,
    CommonService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StackDetailsModule {
  constructor() {}
}
