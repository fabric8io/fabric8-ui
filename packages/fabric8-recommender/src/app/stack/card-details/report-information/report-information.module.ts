/** Vendor imports Go HERE */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap';
/** Vendor imports Go HERE */

import { ProgressMeterModule } from '../../utils/progress-meter/progress-meter.module';
import { ComponentFeedbackModule } from '../../utils/component-feedback/component-feedback.module';

import { ComponentSnippetComponent } from '../component-information/component-snippet/component-snippet.component';
import { ComponentInformationComponent } from '../component-information/component-information.component';
import { ComponentDetailsComponent } from '../component-details/component-details.component';

import { ReportInformationComponent } from './report-information.component';
import { ToastNotificationModule } from '../../toast-notification/toast-notification.module';
import { AddWorkFlowService } from '../../stack-details/add-work-flow.service';

import { NoDataComponent } from './no-data/no-data.component';

const components = [
    ComponentSnippetComponent,
    ComponentInformationComponent,
    ComponentDetailsComponent,
    ReportInformationComponent,
    NoDataComponent
];

const imports = [
    TooltipModule.forRoot(),
    ProgressMeterModule,
    ComponentFeedbackModule,
    ToastNotificationModule
];

@NgModule({
    imports: [
        CommonModule,
        ...imports
    ],
    declarations: [
        ...components
    ],
    providers: [ AddWorkFlowService ],
    exports: [
        ...components
    ]
})
export class ReportInformationModule {}
