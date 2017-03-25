import { runtimeConsoleImports } from './../shared/runtime-console/runtime-console';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { UniqueSpaceNameValidatorDirective, ValidSpaceNameValidatorDirective } from 'ngx-fabric8-wit';


import { SpaceWizardComponent } from './space-wizard.component';
import { WizardDynamicStepComponent } from './components/wizard-dynamic-step/wizard-dynamic-step.component';

import { IForgeServiceProvider } from './services/forge.service';
import { LoggerFactory } from './common/logger';
import { WorkflowFactory, IWorkflowProvider } from './models/workflow'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MultiselectDropdownModule

  ],
  declarations: [
    SpaceWizardComponent,
    WizardDynamicStepComponent,
    UniqueSpaceNameValidatorDirective,
    ValidSpaceNameValidatorDirective
  ],
  exports: [
     SpaceWizardComponent,
     UniqueSpaceNameValidatorDirective
  ],
  providers:[
    IForgeServiceProvider.FactoryProvider,
    LoggerFactory,
    WorkflowFactory
  ]
})
export class SpaceWizardModule {

};
