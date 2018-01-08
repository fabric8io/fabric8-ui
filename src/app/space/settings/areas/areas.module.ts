import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { ModalModule } from 'ngx-modal';
import { ListModule } from 'patternfly-ng';

import { AreasRoutingModule } from './areas-routing.module';
import { AreasComponent } from './areas.component';
import { CreateAreaDialogModule } from './create-area-dialog/create-area-dialog.module';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    AreasRoutingModule,
    ListModule,
    CreateAreaDialogModule,
    ModalModule,
    Fabric8WitModule
  ],
  declarations: [
    AreasComponent
  ],
  providers: [
    BsDropdownConfig
  ]
})
export class AreasModule {
  constructor(http: Http) { }
}
