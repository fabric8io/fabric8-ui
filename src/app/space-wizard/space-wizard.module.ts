import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { UniqueSpaceNameValidatorDirective, ValidSpaceNameValidatorDirective } from 'ngx-fabric8-wit';
import { runtimeConsoleImports } from './../shared/runtime-console/runtime-console';
import { LoggerFactory } from './common/logger';
import { WizardDynamicStepComponent } from './components/wizard-dynamic-step/wizard-dynamic-step.component';
import { WorkflowFactory } from './models/workflow';

import { IForgeServiceProvider } from './services/forge.service';

import { SpaceWizardComponent } from './space-wizard.component';

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
            providers: [
              IForgeServiceProvider.FactoryProvider,
              LoggerFactory,
              WorkflowFactory
            ]
          })
export class SpaceWizardModule {

}

