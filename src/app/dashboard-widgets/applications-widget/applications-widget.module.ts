import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoadingWidgetModule } from '../../dashboard-widgets/loading-widget/loading-widget.module';
import { FeatureFlagModule } from '../../feature-flag/feature-flag.module';
import { ApplicationsListModule } from './applications-list/applications-list.module';
import { ApplicationsWidgetComponent } from './applications-widget.component';

@NgModule({
  imports: [
    ApplicationsListModule,
    CommonModule,
    FeatureFlagModule,
    FormsModule,
    LoadingWidgetModule,
    RouterModule
  ],
  declarations: [ApplicationsWidgetComponent],
  exports: [ApplicationsWidgetComponent]
})
export class ApplicationsWidgetModule { }
