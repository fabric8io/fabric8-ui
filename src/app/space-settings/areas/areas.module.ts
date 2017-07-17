import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-modal';

import { ListModule } from 'patternfly-ng';

import { AreasComponent } from './areas.component';
import { AreasRoutingModule } from './areas-routing.module';

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
