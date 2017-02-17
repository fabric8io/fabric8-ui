import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpaceWizardComponent } from './space-wizard.component';

@NgModule({
  imports: [CommonModule, FormsModule ],
  declarations: [SpaceWizardComponent],
  exports: [SpaceWizardComponent]
})
export class SpaceWizardModule {

}
