import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AlmEditableModule, AlmIconModule } from 'ngx-widgets';
import { Fabric8WitModule } from 'ngx-fabric8-wit';

import { EditSpaceDescriptionWidgetComponent } from './edit-space-description-widget.component';


@NgModule({
  imports: [CommonModule, FormsModule, AlmIconModule,
    AlmEditableModule, Fabric8WitModule],
  declarations: [EditSpaceDescriptionWidgetComponent],
  exports: [EditSpaceDescriptionWidgetComponent]
})
export class EditSpaceDescriptionWidgetModule { }
