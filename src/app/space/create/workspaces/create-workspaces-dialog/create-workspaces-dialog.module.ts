import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TypeaheadModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-modal';

import { CreateWorkspacesDialogComponent } from './create-workspaces-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    TypeaheadModule.forRoot()
  ],
  declarations: [ CreateWorkspacesDialogComponent ],
  exports: [ CreateWorkspacesDialogComponent, ModalModule ]
})
export class CreateWorkspacesDialogModule { }
