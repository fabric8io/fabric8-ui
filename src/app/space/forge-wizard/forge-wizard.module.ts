import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgeImportWizardComponent } from 'app/space/forge-wizard/import-wizard.component';
import { ForgeQuickstartComponent } from 'app/space/forge-wizard/quickstart-wizard.component';
import { WizardModule } from 'patternfly-ng';
import { OrganisationComponent } from 'app/space/forge-wizard/import-pages/step1/organisation-step.component';
import { PipelineViewComponent } from 'app/space/forge-wizard/components/pipeline-view/pipeline-view.component';
import { SingleSelectionDropDownComponent } from 'app/space/forge-wizard/components/single-selection-dropdown/single-selection-dropdown.component';
import { RepositoriesComponent } from 'app/space/forge-wizard/import-pages/step2/repositories-step.component';
import { MultipleSelectionListComponent } from 'app/space/forge-wizard/components/multiple-selection-list/multiple-selection-list.component';
import { SelectedItemsPipe } from 'app/space/forge-wizard/components/multiple-selection-list/selected-items.pipe';
import { VisibleItemsPipe } from 'app/space/forge-wizard/components/multiple-selection-list/visible-items.pipe';
import { PipelineStepComponent } from 'app/space/forge-wizard/import-pages/step3/pipeline-step.component';
import { BuildConfigStepComponent } from './import-pages/step4/build-config-step.component';
import { SingleInputComponent } from './components/single-input/single-input.component';
import { ReviewStepComponent } from './import-pages/step5/review-step.component';
import { ForgeErrorsComponent } from './components/forge-errors/forge-errors.component';
import { FlowSelectorComponent } from './components/flow-selector/flow-selector.component';
import { ChooseQuickstartComponent } from './quickstart-pages/step1/choose-quickstart.component';
import { ProjectInfoStepComponent } from './quickstart-pages/step2/project-info-step.component';
import { PipelineQuickstartStepComponent } from './quickstart-pages/step3/pipeline-quickstart-step.component';
import { ProjectSelectModule } from './components/project-select/project-select.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardModule,
    ProjectSelectModule
  ],
  declarations: [
    ForgeImportWizardComponent,
    ForgeQuickstartComponent,
    SingleSelectionDropDownComponent,
    MultipleSelectionListComponent,
    PipelineViewComponent,
    SingleInputComponent,
    ForgeErrorsComponent,
    FlowSelectorComponent,
    SelectedItemsPipe,
    VisibleItemsPipe,
    ProjectInfoStepComponent,
    OrganisationComponent,
    RepositoriesComponent,
    BuildConfigStepComponent,
    PipelineStepComponent,
    PipelineQuickstartStepComponent,
    ReviewStepComponent,
    ChooseQuickstartComponent
  ],
  exports: [
    ForgeImportWizardComponent,
    ForgeQuickstartComponent,
    FlowSelectorComponent
  ],
  providers: [

  ]
})

export class ForgeWizardModule {

}
