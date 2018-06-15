import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LoadingWidgetModule } from '../../dashboard-widgets/loading-widget/loading-widget.module';
import { FeatureFlagModule } from '../../feature-flag/feature-flag.module';

import { AddCodebaseWidgetRoutingModule } from './add-codebase-widget-routing.module';
import { AddCodebaseWidgetComponent } from './add-codebase-widget.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AddCodebaseWidgetRoutingModule,
    FeatureFlagModule,
    LoadingWidgetModule
  ],
  declarations: [AddCodebaseWidgetComponent],
  exports: [AddCodebaseWidgetComponent]
})
export class AddCodebaseWidgetModule { }
