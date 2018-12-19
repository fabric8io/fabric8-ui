import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddCollaboratorsDialogComponent } from './add-collaborators-dialog.component';

@NgModule({
  imports: [CommonModule, ModalModule.forRoot(), FormsModule, NgSelectModule],
  declarations: [AddCollaboratorsDialogComponent],
  exports: [AddCollaboratorsDialogComponent, ModalModule],
})
export class AddCollaboratorsDialogModule {}
