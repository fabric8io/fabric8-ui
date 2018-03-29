import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TokenProvider } from 'ngx-forge';
import { Config, NgxForgeModule } from 'ngx-forge';
import {
  ForgeErrorsComponent,
  ForgeExceptionComponent,
  MultipleSelectionListComponent,
  PipelineViewComponent,
  SelectedItemsPipe,
  SingleSelectionDropDownComponent,
  SpinnerComponent,
  VisibleItemsPipe
} from 'ngx-forge';
import { AuthenticationService } from 'ngx-login-client';
import { FilterModule } from 'patternfly-ng/filter';
import { WizardModule } from 'patternfly-ng/wizard';

import { FlowSelectorComponent } from './components/flow-selector/flow-selector.component';
import { SingleInputComponent } from './components/single-input/single-input.component';
import { OrganisationComponent } from './import-pages/step1/organisation-step.component';
import { RepositoriesComponent } from './import-pages/step2/repositories-step.component';
import { PipelineStepComponent } from './import-pages/step3/pipeline-step.component';
import { BuildConfigStepComponent } from './import-pages/step4/build-config-step.component';
import { ReviewStepComponent } from './import-pages/step5/review-step.component';
import { ForgeImportWizardComponent } from './import-wizard.component';
import { ChooseQuickstartComponent } from './quickstart-pages/step1/choose-quickstart.component';
import { ProjectInfoStepComponent } from './quickstart-pages/step2/project-info-step.component';
import { FormatNameValidationPipe } from './quickstart-pages/step2/project-name-validation.pipe';
import { PipelineQuickstartStepComponent } from './quickstart-pages/step3/pipeline-quickstart-step.component';
import { ForgeQuickstartComponent } from './quickstart-wizard.component';
import { ForgeConfig } from './service/forge-config';
import { KeycloakTokenProvider } from './service/token-provider';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardModule,
    FilterModule,
    NgxForgeModule
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
    SpinnerComponent,
    SelectedItemsPipe,
    VisibleItemsPipe,
    FormatNameValidationPipe,
    ProjectInfoStepComponent,
    OrganisationComponent,
    RepositoriesComponent,
    BuildConfigStepComponent,
    PipelineStepComponent,
    PipelineQuickstartStepComponent,
    ReviewStepComponent,
    ChooseQuickstartComponent,
    ForgeExceptionComponent
  ],
  exports: [
    ForgeImportWizardComponent,
    ForgeQuickstartComponent,
    FlowSelectorComponent
  ],
  providers: [
    {
      provide: Config, useClass: ForgeConfig
    },
    {
      provide: TokenProvider,
      useFactory: (auth: AuthenticationService) => new KeycloakTokenProvider(auth),
      deps: [AuthenticationService]
    }
  ]
})

export class ForgeWizardModule {

}
