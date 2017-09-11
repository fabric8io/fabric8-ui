import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ForgeWizardComponent } from "app/space/forge-wizard/forge-wizard.component";
import { WizardModule } from 'patternfly-ng'
import { OrganisationComponent } from "app/space/forge-wizard/import-pages/organisation-step.component";
import { SingleSelectionDropDownComponent } from 'app/space/forge-wizard/components/single-selection-dropdown/single-selection-dropdown.component'
import { RepositoriesComponent } from "app/space/forge-wizard/import-pages/repositories-step.component";
import { MultipleSelectionListComponent } from "app/space/forge-wizard/components/multiple-selection-list/multiple-selection-list.component";
import { SelectedItemsPipe } from "app/space/forge-wizard/components/multiple-selection-list/selected-items.pipe";
import { VisibleItemsPipe } from "app/space/forge-wizard/components/multiple-selection-list/visible-items.pipe";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WizardModule
  ],
  declarations: [
    ForgeWizardComponent,
    SingleSelectionDropDownComponent,
    MultipleSelectionListComponent,
    SelectedItemsPipe,
    VisibleItemsPipe,
    OrganisationComponent,
    RepositoriesComponent
  ],
  exports: [
    ForgeWizardComponent,
  ],
  providers: [

  ]
})

export class ForgeWizardModule {

}
