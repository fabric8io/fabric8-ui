import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgArrayPipesModule } from 'angular-pipes';
import { PlannerListModule, WorkItemDetailModule } from 'fabric8-planner';
import { FeatureFlagModule } from 'ngx-feature-flag';
import { WidgetsModule } from 'ngx-widgets';
import { TruncateModule } from 'ng2-truncate';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LoadingWidgetModule } from '../loading-widget/loading-widget.module';
import { WorkItemBarchartModule } from '../work-item-widget/work-item-barchart/work-item-barchart.module';
import { SpaceSettingsWidgetComponent } from './space-settings-widget.component';
import { EditSpaceDescriptionWidgetModule } from '../edit-space-description-widget/edit-space-description-widget.module';
import { AddCollaboratorsDialogModule } from '../../space/settings/collaborators/add-collaborators-dialog/add-collaborators-dialog.module';

@NgModule({
  imports: [
    RouterModule,
    ModalModule,
    CommonModule,
    FeatureFlagModule,
    TruncateModule,
    LoadingWidgetModule,
    NgArrayPipesModule,
    AddCollaboratorsDialogModule,
    EditSpaceDescriptionWidgetModule,
  ],

  declarations: [SpaceSettingsWidgetComponent],
  exports: [SpaceSettingsWidgetComponent],
})
export class SpaceSettingsWidgetModule {}
