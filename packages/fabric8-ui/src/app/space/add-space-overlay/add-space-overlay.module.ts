import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Fabric8WitModule, SpaceNameModule } from 'ngx-fabric8-wit';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AutofocusModule } from 'ngx-widgets';
import { SpaceTemplateService } from '../../shared/space-template.service';

import { CodebasesService } from '../create/codebases/services/codebases.service';
import { AddSpaceOverlayComponent } from './add-space-overlay.component';

@NgModule({
  imports: [
    AutofocusModule,
    CommonModule,
    FormsModule,
    Fabric8WitModule,
    ModalModule,
    SpaceNameModule,
  ],
  declarations: [AddSpaceOverlayComponent],
  exports: [AddSpaceOverlayComponent],
  providers: [CodebasesService, SpaceTemplateService],
})
export class AddSpaceOverlayModule {}
