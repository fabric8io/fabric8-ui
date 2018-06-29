import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Fabric8WitModule } from 'ngx-fabric8-wit';

import { ActionModule } from 'patternfly-ng/action';
import { TreeListModule } from 'patternfly-ng/list';

import { AreasRoutingModule } from './areas-routing.module';
import { AreasToolbarModule } from './areas-toolbar/areas-toolbar.module';
import { AreasComponent } from './areas.component';
import { CreateAreaDialogModule } from './create-area-dialog/create-area-dialog.module';

@NgModule({
  imports: [
    ActionModule,
    AreasToolbarModule,
    AreasRoutingModule,
    BsDropdownModule.forRoot(),
    CommonModule,
    CreateAreaDialogModule,
    Fabric8WitModule,
    TreeListModule,
    ModalModule.forRoot()
  ],
  declarations: [
    AreasComponent
  ],
  providers: [
    BsDropdownConfig
  ]
})
export class AreasModule {
  constructor() { }
}
