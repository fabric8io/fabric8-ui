import { EnvironmentWidgetModule } from './../../dashboard-widgets/environment-widget/environment-widget.module';
import { PipelinesWidgetModule } from './../../dashboard-widgets/pipelines-widget/pipelines-widget.module';
import { AddCodebaseWidgetModule } from './../../dashboard-widgets/add-codebase-widget/add-codebase-widget.module';
import { CreateWorkItemWidgetModule } from './../../dashboard-widgets/create-work-item-widget/create-work-item-widget.module';
import { AnalyticalReportWidgetModule } from './../../dashboard-widgets/analytical-report-widget/analytical-report-widget.module';
import { EditSpaceDescriptionWidgetModule } from './../../dashboard-widgets/edit-space-description-widget/edit-space-description-widget.module';
import { TeamMembershipDialogModule } from './../../team-membership-dialog/team-membership-dialog.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { ModalModule } from 'ngx-modal';
import { FormsModule } from '@angular/forms';
// import { Broadcaster } from 'ngx-login-client';

import { AnalyzeOverviewComponent } from './analyze-overview.component';
import { AnalyzeOverviewRoutingModule } from './analyze-overview-routing.module';



@NgModule({
  imports: [
    CommonModule,
    AnalyzeOverviewRoutingModule,
    HttpModule,
    ModalModule,
    FormsModule,
    TeamMembershipDialogModule,
    EditSpaceDescriptionWidgetModule,
    AnalyticalReportWidgetModule,
    CreateWorkItemWidgetModule,
    AddCodebaseWidgetModule,
    PipelinesWidgetModule,
    EnvironmentWidgetModule
  ],
  declarations: [AnalyzeOverviewComponent]
})
export class AnalyzeOverviewModule {
  constructor(http: Http) { }
}
