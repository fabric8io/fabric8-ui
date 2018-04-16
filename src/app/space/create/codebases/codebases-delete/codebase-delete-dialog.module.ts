import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';

import { CodebaseDeleteDialogComponent } from './codebase-delete-dialog.component';

@NgModule({
  imports:      [ CommonModule, ModalModule.forRoot() ],
  declarations: [ CodebaseDeleteDialogComponent ],
  exports: [ CodebaseDeleteDialogComponent, ModalModule ]
})
export class CodebaseDeleteDialogModule { }
