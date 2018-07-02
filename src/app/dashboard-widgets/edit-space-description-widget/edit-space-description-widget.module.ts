import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { FeatureFlagModule } from 'ngx-feature-flag';
import { AlmEditableModule, AlmIconModule } from 'ngx-widgets';
import { EditSpaceDescriptionWidgetComponent } from './edit-space-description-widget.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AlmIconModule,
    AlmEditableModule,
    Fabric8WitModule,
    FeatureFlagModule,
    RouterModule
  ],
  declarations: [EditSpaceDescriptionWidgetComponent],
  exports: [EditSpaceDescriptionWidgetComponent]
})
export class EditSpaceDescriptionWidgetModule { }
