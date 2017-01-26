import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ng2-modal';
import { SpaceDialogModule } from '../space-dialog/space-dialog.module';

import { SpaceWizardComponent } from './space-wizard.component';

@NgModule({
  imports: [CommonModule, ModalModule, FormsModule, SpaceDialogModule],
  declarations: [SpaceWizardComponent],
  exports: [SpaceWizardComponent, ModalModule]
})
export class SpaceWizardModule {

}
