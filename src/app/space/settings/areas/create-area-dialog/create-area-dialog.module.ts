import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-modal';

import { CreateAreaDialogComponent } from './create-area-dialog.component';

@NgModule({
  imports:      [ CommonModule, ModalModule, FormsModule ],
  declarations: [ CreateAreaDialogComponent ],
  exports: [ CreateAreaDialogComponent, ModalModule ]
})
export class CreateAreaDialogModule { }
