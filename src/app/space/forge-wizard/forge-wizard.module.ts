import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ForgeWizardComponent } from "app/space/forge-wizard/forge-wizard.component";
import { WizardModule } from 'patternfly-ng'
import { OrganisationComponent } from "app/space/forge-wizard/import-pages/step1/organisation-step.component";
import { PipelineViewComponent } from "app/space/forge-wizard/components/pipeline-view/pipeline-view.component";
import { SingleSelectionDropDownComponent } from 'app/space/forge-wizard/components/single-selection-dropdown/single-selection-dropdown.component'
import { RepositoriesComponent } from "app/space/forge-wizard/import-pages/step2/repositories-step.component";
import { MultipleSelectionListComponent } from "app/space/forge-wizard/components/multiple-selection-list/multiple-selection-list.component";
import { SelectedItemsPipe } from "app/space/forge-wizard/components/multiple-selection-list/selected-items.pipe";
import { VisibleItemsPipe } from "app/space/forge-wizard/components/multiple-selection-list/visible-items.pipe";
import { PipelineStepComponent } from "app/space/forge-wizard/import-pages/step3/pipeline-step.component";

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
    PipelineViewComponent,
    SelectedItemsPipe,
    VisibleItemsPipe,
    OrganisationComponent,
    RepositoriesComponent,
    PipelineStepComponent
  ],
  exports: [
    ForgeWizardComponent,
  ],
  providers: [

  ]
})

export class ForgeWizardModule {

}
