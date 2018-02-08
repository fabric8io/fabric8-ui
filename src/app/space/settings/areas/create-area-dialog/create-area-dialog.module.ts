import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap';

import { CreateAreaDialogComponent } from './create-area-dialog.component';

@NgModule({
  imports:      [ CommonModule, ModalModule, FormsModule ],
  declarations: [ CreateAreaDialogComponent ],
  exports:      [ CreateAreaDialogComponent, ModalModule ]
})
export class CreateAreaDialogModule { }
