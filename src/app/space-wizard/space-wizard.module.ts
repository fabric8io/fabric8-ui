import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UniqueSpaceNameValidatorDirective, ValidSpaceNameValidatorDirective, Fabric8WitModule } from 'ngx-fabric8-wit';

import { runtimeConsoleImports } from './../shared/runtime-console/runtime-console';
import { LoggerFactory } from './common/logger';
import { ForgeAppGeneratorComponent } from './components/forge-app-generator/forge-app-generator.component';
import { AppGeneratorBuildPipelineViewComponent } from './components/app-generator-build-pipeline-view/app-generator-build-pipeline-view.component';
import { AppGeneratorSingleSelectionListComponent } from './components/app-generator-single-selection-list/app-generator-single-selection-list.component';
import { AppGeneratorSingleSelectionDropDownComponent } from './components/app-generator-single-selection-dropdown/app-generator-single-selection-dropdown.component';
import { AppGeneratorSingleInputComponent } from './components/app-generator-single-input/app-generator-single-input.component';
import { AppGeneratorStepViewComponent } from './components/app-generator-step-view/app-generator-step-view.component';
import { AppGeneratorMultipleSelectionLabelListComponent } from './components/app-generator-multiple-selection-label-list/app-generator-multiple-selection-label-list.component';
import { SpaceConfiguratorComponent } from './components/space-configurator/space-configurator.component';
import { SpaceCreatorComponent } from './components/space-creator/space-creator.component';

import { WorkflowFactory } from './models/workflow';

import { IForgeServiceProvider } from './services/forge.service';
import { AppGeneratorConfiguratorService, IAppGeneratorServiceProvider } from './services/app-generator.service';
import { SpaceWizardComponent } from './space-wizard.component';
import { SelectedItemsPipe } from './pipes/selected-items.pipe';
import { VisibleItemsPipe } from './pipes/visible-items.pipe';
import { TrustHtmlPipe, TrustStylePipe } from './pipes/safe-html.pipe';
import { CodebasesService } from '../space/create/codebases/services/codebases.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Fabric8WitModule
  ],
  declarations: [
    SpaceWizardComponent,
    ForgeAppGeneratorComponent,
    AppGeneratorStepViewComponent,
    AppGeneratorSingleInputComponent,
    AppGeneratorSingleSelectionListComponent,
    AppGeneratorSingleSelectionDropDownComponent,
    AppGeneratorMultipleSelectionLabelListComponent,
    AppGeneratorBuildPipelineViewComponent,
    SpaceConfiguratorComponent,
    SpaceCreatorComponent,
    UniqueSpaceNameValidatorDirective,
    ValidSpaceNameValidatorDirective,
    SelectedItemsPipe,
    VisibleItemsPipe,
    TrustHtmlPipe,
    TrustStylePipe
  ],
  exports: [
    SpaceWizardComponent,
    UniqueSpaceNameValidatorDirective
  ],
  providers: [
    IForgeServiceProvider.FactoryProvider,
    LoggerFactory,
    WorkflowFactory,
    IAppGeneratorServiceProvider.FactoryProvider,
    AppGeneratorConfiguratorService,
    CodebasesService
  ]
})

export class SpaceWizardModule {

}
