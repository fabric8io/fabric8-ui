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

import { SingleInputComponent } from './components/single-input/single-input.component';
import { ChooseQuickstartComponent } from './quickstart-pages/step1/choose-quickstart.component';
import { ProjectInfoStepComponent } from './quickstart-pages/step2/project-info-step.component';
import { FormatNameValidationPipe } from './quickstart-pages/step2/project-name-validation.pipe';
import { PipelineQuickstartStepComponent } from './quickstart-pages/step3/pipeline-quickstart-step.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardModule,
    FilterModule,
    NgxForgeModule
  ],
  declarations: [
    SingleSelectionDropDownComponent,
    MultipleSelectionListComponent,
    PipelineViewComponent,
    SingleInputComponent,
    ForgeErrorsComponent,
    SpinnerComponent,
    SelectedItemsPipe,
    VisibleItemsPipe,
    FormatNameValidationPipe,
    ProjectInfoStepComponent,
    PipelineQuickstartStepComponent,
    ChooseQuickstartComponent,
    ForgeExceptionComponent
  ]
})

export class ForgeWizardModule {

}
