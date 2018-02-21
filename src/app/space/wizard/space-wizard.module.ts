import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Fabric8WitModule, UniqueSpaceNameValidatorDirective, ValidSpaceNameValidatorDirective } from 'ngx-fabric8-wit';

import { AddSpaceOverlayModule } from '../add-space-overlay/add-space-overlay.module';
import { CodebasesService } from '../create/codebases/services/codebases.service';
import { TrustHtmlPipe, TrustStylePipe } from './pipes/safe-html.pipe';
import { SelectedItemsPipe } from './pipes/selected-items.pipe';
import { VisibleItemsPipe } from './pipes/visible-items.pipe';
import { SpaceWizardComponent } from './space-wizard.component';

@NgModule({
  imports: [
    AddSpaceOverlayModule,
    CommonModule,
    FormsModule,
    Fabric8WitModule
  ],
  declarations: [
    SpaceWizardComponent
  ],
  exports: [
    SpaceWizardComponent
  ],
  providers: [
    CodebasesService
  ]
})

export class SpaceWizardModule {

}
