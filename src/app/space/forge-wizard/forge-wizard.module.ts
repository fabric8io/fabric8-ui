import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ForgeWizardComponent } from "app/space/forge-wizard/forge-wizard.component";
import { WizardModule } from 'patternfly-ng'
import { OrganisationComponent } from "app/space/forge-wizard/import-pages/organisation-step.component";
import { SingleSelectionDropDownComponent } from 'app/space/forge-wizard/components/single-selection-dropdown/single-selection-dropdown.component'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WizardModule
  ],
  declarations: [
    ForgeWizardComponent,
    SingleSelectionDropDownComponent,
    OrganisationComponent
  ],
  exports: [
    ForgeWizardComponent,
  ],
  providers: [

  ]
})

export class ForgeWizardModule {

}
