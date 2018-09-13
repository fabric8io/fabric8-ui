import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeatureFlagModule } from 'ngx-feature-flag';
import { LoadingWidgetModule } from '../../dashboard-widgets/loading-widget/loading-widget.module';
import { AddCodebaseWidgetRoutingModule } from './add-codebase-widget-routing.module';
import { AddCodebaseWidgetComponent } from './add-codebase-widget.component';
import { CodebaseItemModule } from './codebase-item/codebase-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AddCodebaseWidgetRoutingModule,
    FeatureFlagModule,
    LoadingWidgetModule,
    CodebaseItemModule
  ],
  declarations: [AddCodebaseWidgetComponent],
  exports: [AddCodebaseWidgetComponent]
})
export class AddCodebaseWidgetModule { }
