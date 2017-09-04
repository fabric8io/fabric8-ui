import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ForgeWizardComponent } from "app/space/forge-wizard/forge-wizard.component";
import { WizardModule} from 'patternfly-ng'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WizardModule
  ],
  declarations: [
    ForgeWizardComponent,
  ],
  exports: [
    ForgeWizardComponent,
  ],
  providers: [

  ]
})

export class ForgeWizardModule {

}
