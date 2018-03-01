import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Fabric8WitModule } from 'ngx-fabric8-wit';

import { CodebasesService } from '../create/codebases/services/codebases.service';
import { AddAppOverlayComponent } from './add-app-overlay.component';

@NgModule({
  imports: [
    CommonModule,
    Fabric8WitModule,
    FormsModule
  ],
  declarations: [
    AddAppOverlayComponent
  ],
  exports: [
    AddAppOverlayComponent
  ],
  providers: [
    CodebasesService
  ]
})

export class AddAppOverlayModule {

}
