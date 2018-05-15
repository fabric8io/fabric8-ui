import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { AlmEditableModule, AlmIconModule } from 'ngx-widgets';
import { FeatureFlagModule } from '../../feature-flag/feature-flag.module';
import { EditSpaceDescriptionWidgetOldComponent } from './edit-space-description-widget-old.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AlmIconModule,
    AlmEditableModule,
    Fabric8WitModule,
    FeatureFlagModule
  ],
  declarations: [EditSpaceDescriptionWidgetOldComponent],
  exports: [EditSpaceDescriptionWidgetOldComponent]
})
export class EditSpaceDescriptionWidgetOldModule { }
