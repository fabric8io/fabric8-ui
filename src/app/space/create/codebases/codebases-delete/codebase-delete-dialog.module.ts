import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-modal';

import { CodebaseDeleteDialogComponent } from './codebase-delete-dialog.component';

@NgModule({
  imports:      [ CommonModule, ModalModule ],
  declarations: [ CodebaseDeleteDialogComponent ],
  exports: [ CodebaseDeleteDialogComponent, ModalModule ]
})
export class CodebaseDeleteDialogModule { }
