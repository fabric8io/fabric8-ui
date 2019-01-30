import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FeatureFlagModule } from 'ngx-feature-flag';
import { AddCodebaseWidgetModule } from '../../../dashboard-widgets/add-codebase-widget/add-codebase-widget.module';
import { AnalyticalReportWidgetModule } from '../../../dashboard-widgets/analytical-report-widget/analytical-report-widget.module';
import { ApplicationsWidgetModule } from '../../../dashboard-widgets/applications-widget/applications-widget.module';
import { CreateWorkItemWidgetModule } from '../../../dashboard-widgets/create-work-item-widget/create-work-item-widget.module';
import { EditSpaceDescriptionWidgetOldModule } from '../../../dashboard-widgets/edit-space-description-widget-old/edit-space-description-widget-old.module';
import { EditSpaceDescriptionWidgetModule } from '../../../dashboard-widgets/edit-space-description-widget/edit-space-description-widget.module';
import { EnvironmentWidgetComponent } from '../../../dashboard-widgets/environment-widget/environment-widget.component';
import { EnvironmentWidgetModule } from '../../../dashboard-widgets/environment-widget/environment-widget.module';
import { PipelinesWidgetModule } from '../../../dashboard-widgets/pipelines-widget/pipelines-widget.module';
import { WorkItemWidgetModule } from '../../../dashboard-widgets/work-item-widget/work-item-widget.module';
import { SpaceSettingsWidgetModule } from '../../../dashboard-widgets/space-settings-widget/space-settings-widget.module';
import { AddCollaboratorsDialogModule } from '../../settings/collaborators/add-collaborators-dialog/add-collaborators-dialog.module';
import { AnalyzeOverviewRoutingModule } from './analyze-overview-routing.module';
import { AnalyzeOverviewComponent } from './analyze-overview.component';

@NgModule({
  imports: [
    CommonModule,
    AnalyzeOverviewRoutingModule,
    ApplicationsWidgetModule,
    FeatureFlagModule,
    FormsModule,
    EditSpaceDescriptionWidgetOldModule,
    EditSpaceDescriptionWidgetModule,
    EnvironmentWidgetModule,
    AnalyticalReportWidgetModule,
    CreateWorkItemWidgetModule,
    AddCodebaseWidgetModule,
    PipelinesWidgetModule,
    AddCollaboratorsDialogModule,
    ModalModule.forRoot(),
    WorkItemWidgetModule,
    SpaceSettingsWidgetModule,
  ],
  declarations: [AnalyzeOverviewComponent],
  entryComponents: [EnvironmentWidgetComponent],
})
export class AnalyzeOverviewModule {
  constructor() {}
}
