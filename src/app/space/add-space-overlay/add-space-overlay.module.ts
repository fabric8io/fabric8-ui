import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Fabric8WitModule, UniqueSpaceNameValidatorDirective, ValidSpaceNameValidatorDirective } from 'ngx-fabric8-wit';

import { CodebasesService } from '../create/codebases/services/codebases.service';
import { TrustHtmlPipe, TrustStylePipe } from '../wizard/pipes/safe-html.pipe';
import { SelectedItemsPipe } from '../wizard/pipes/selected-items.pipe';
import { VisibleItemsPipe } from '../wizard/pipes/visible-items.pipe';
import { AddSpaceOverlayComponent } from './add-space-overlay.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Fabric8WitModule
  ],
  declarations: [
    AddSpaceOverlayComponent
  ],
  exports: [
    AddSpaceOverlayComponent
  ],
  providers: [
    CodebasesService
  ]
})

export class AddSpaceOverlayModule {

}
