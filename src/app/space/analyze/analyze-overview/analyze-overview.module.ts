import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { ModalModule } from 'ngx-bootstrap/modal';

import { ForgeWizardModule } from 'app/space/forge-wizard/forge-wizard.module';
import { AddCodebaseWidgetModule } from '../../../dashboard-widgets/add-codebase-widget/add-codebase-widget.module';
import { AnalyticalReportWidgetModule } from '../../../dashboard-widgets/analytical-report-widget/analytical-report-widget.module';
import { CreateWorkItemWidgetModule } from '../../../dashboard-widgets/create-work-item-widget/create-work-item-widget.module';
import { EditSpaceDescriptionWidgetModule } from '../../../dashboard-widgets/edit-space-description-widget/edit-space-description-widget.module';
import { EnvironmentWidgetModule } from '../../../dashboard-widgets/environment-widget/environment-widget.module';
import { PipelinesWidgetModule } from '../../../dashboard-widgets/pipelines-widget/pipelines-widget.module';
import { AnalyzeOverviewRoutingModule } from './analyze-overview-routing.module';
import { AnalyzeOverviewComponent } from './analyze-overview.component';

@NgModule({
  imports: [
    CommonModule,
    AnalyzeOverviewRoutingModule,
    FormsModule,
    EditSpaceDescriptionWidgetModule,
    AnalyticalReportWidgetModule,
    CreateWorkItemWidgetModule,
    AddCodebaseWidgetModule,
    PipelinesWidgetModule,
    EnvironmentWidgetModule,
    ForgeWizardModule,
    ModalModule.forRoot()
  ],
  declarations: [AnalyzeOverviewComponent]
})
export class AnalyzeOverviewModule {
  constructor(http: Http) { }
}
