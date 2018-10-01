import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Fabric8WitModule, SpaceNameModule } from 'ngx-fabric8-wit';
import { SpaceTemplateService } from '../../shared/space-template.service';

import { CodebasesService } from '../create/codebases/services/codebases.service';
import { AddSpaceOverlayComponent } from './add-space-overlay.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Fabric8WitModule,
    SpaceNameModule
  ],
  declarations: [
    AddSpaceOverlayComponent
  ],
  exports: [
    AddSpaceOverlayComponent
  ],
  providers: [
    CodebasesService,
    SpaceTemplateService
  ]
})

export class AddSpaceOverlayModule {

}
