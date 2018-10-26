import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { FeatureFlagModule } from 'ngx-feature-flag';
import { AlmEditableModule, AlmIconModule } from 'ngx-widgets';
import { ListModule } from 'patternfly-ng';
import { AddCollaboratorsDialogModule } from '../../space/settings/collaborators/add-collaborators-dialog/add-collaborators-dialog.module';
import { EditSpaceDescriptionWidgetComponent } from './edit-space-description-widget.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AlmIconModule,
    AlmEditableModule,
    AddCollaboratorsDialogModule,
    Fabric8WitModule,
    FeatureFlagModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    ListModule,
    RouterModule
  ],
  declarations: [EditSpaceDescriptionWidgetComponent],
  exports: [EditSpaceDescriptionWidgetComponent]
})
export class EditSpaceDescriptionWidgetModule { }
