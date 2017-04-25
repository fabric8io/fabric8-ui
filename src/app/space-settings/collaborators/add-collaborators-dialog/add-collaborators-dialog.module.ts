import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-modal';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { AddCollaboratorsDialogComponent } from './add-collaborators-dialog.component';

@NgModule({
  imports:      [ CommonModule, ModalModule, FormsModule, MultiselectDropdownModule ],
  declarations: [ AddCollaboratorsDialogComponent ],
  exports: [ AddCollaboratorsDialogComponent, ModalModule ]
})
export class AddCollaboratorsDialogModule { }
