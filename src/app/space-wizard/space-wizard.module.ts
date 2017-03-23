import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UniqueSpaceNameValidatorDirective, ValidSpaceNameValidatorDirective } from 'ngx-fabric8-wit';

import { SpaceWizardComponent } from './space-wizard.component';
import { WizardDynamicStepComponent } from './components/wizard-dynamic-step/wizard-dynamic-step.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect'

import { IForgeServiceProvider } from './services/forge.service'
import { LoggerFactory } from './common/logger'
import { WorkflowFactory, IWorkflowProvider } from './models/workflow'

@NgModule({
  imports: [CommonModule, FormsModule,MultiselectDropdownModule],
  declarations: [SpaceWizardComponent, UniqueSpaceNameValidatorDirective, ValidSpaceNameValidatorDirective,WizardDynamicStepComponent],
  exports: [SpaceWizardComponent,UniqueSpaceNameValidatorDirective],
  providers: [IForgeServiceProvider.FactoryProvider, LoggerFactory, WorkflowFactory]
})
export class SpaceWizardModule {

};
