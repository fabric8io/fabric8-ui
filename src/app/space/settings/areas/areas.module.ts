import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { ListModule } from 'patternfly-ng';

import { AreasRoutingModule } from './areas-routing.module';
import { AreasComponent } from './areas.component';
import { CreateAreaDialogComponent } from './create-area-dialog/create-area-dialog.component';
import { CreateAreaDialogModule } from './create-area-dialog/create-area-dialog.module';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    AreasRoutingModule,
    ListModule,
    CreateAreaDialogModule,
    ModalModule.forRoot(),
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
