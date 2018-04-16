import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AddCollaboratorsDialogComponent } from './add-collaborators-dialog.component';

@NgModule({
  imports:      [ CommonModule, ModalModule.forRoot(), FormsModule, MultiselectDropdownModule ],
  declarations: [ AddCollaboratorsDialogComponent ],
  exports: [ AddCollaboratorsDialogComponent, ModalModule ]
})
export class AddCollaboratorsDialogModule { }
