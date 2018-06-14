import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Fabric8WitModule, UniqueSpaceNameValidatorDirective, ValidSpaceNameValidatorDirective } from 'ngx-fabric8-wit';

import { CodebasesService } from '../create/codebases/services/codebases.service';
import { AddSpaceOverlayComponent } from './add-space-overlay.component';

import { SpaceTemplateService } from '../../shared/space-template.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Fabric8WitModule
  ],
  declarations: [
    AddSpaceOverlayComponent,
    UniqueSpaceNameValidatorDirective,
    ValidSpaceNameValidatorDirective
  ],
  exports: [
    AddSpaceOverlayComponent,
    UniqueSpaceNameValidatorDirective,
    ValidSpaceNameValidatorDirective
  ],
  providers: [
    CodebasesService,
    SpaceTemplateService
  ]
})

export class AddSpaceOverlayModule {

}
