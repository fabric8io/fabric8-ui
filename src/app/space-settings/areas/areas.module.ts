import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { DropdownModule } from 'ng2-bootstrap';
import { ListViewModule } from 'ngx-widgets';
import { ModalModule } from 'ngx-modal';

import { AreasComponent } from './areas.component';
import { AreasRoutingModule } from './areas-routing.module';

import { CreateAreaDialogModule } from './create-area-dialog/create-area-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    AreasRoutingModule,
    ListViewModule,
    DropdownModule,
    CreateAreaDialogModule,
    ModalModule,
    Fabric8WitModule
  ],
  declarations: [
    AreasComponent
    ],
})
export class AreasModule {
  constructor(http: Http) { }
}
