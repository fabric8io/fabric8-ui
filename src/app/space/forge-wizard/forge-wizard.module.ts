import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgeImportWizardComponent } from './import-wizard.component';
import { ForgeQuickstartComponent } from './quickstart-wizard.component';
import { WizardModule, FilterModule } from 'patternfly-ng';
import { OrganisationComponent } from './import-pages/step1/organisation-step.component';
import { RepositoriesComponent } from './import-pages/step2/repositories-step.component';
import { PipelineStepComponent } from './import-pages/step3/pipeline-step.component';
import { BuildConfigStepComponent } from './import-pages/step4/build-config-step.component';
import { SingleInputComponent } from './components/single-input/single-input.component';
import { ReviewStepComponent } from './import-pages/step5/review-step.component';
import { FlowSelectorComponent } from './components/flow-selector/flow-selector.component';
import { ChooseQuickstartComponent } from './quickstart-pages/step1/choose-quickstart.component';
import { ProjectInfoStepComponent } from './quickstart-pages/step2/project-info-step.component';
import { PipelineQuickstartStepComponent } from './quickstart-pages/step3/pipeline-quickstart-step.component';
import { NgxForgeModule, Config } from 'ngx-forge';
import { ForgeConfig } from './service/forge-config';
import { TokenProvider } from 'ngx-forge';
import { AuthenticationService } from 'ngx-login-client';
import { KeycloakTokenProvider } from './service/token-provider';
import { FormatNameValidationPipe } from './quickstart-pages/step2/project-name-validation.pipe';
import {
  ForgeErrorsComponent,
  ForgeExceptionComponent,
  MultipleSelectionListComponent,
  PipelineViewComponent,
  SingleSelectionDropDownComponent,
  SpinnerComponent,
  SelectedItemsPipe,
  VisibleItemsPipe
} from 'ngx-forge';

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
