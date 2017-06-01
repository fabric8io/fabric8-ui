import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { DropdownModule } from 'ng2-bootstrap';
import { ListViewModule, InfiniteScrollModule } from 'ngx-widgets';
import { ModalModule } from 'ngx-modal';

import { CollaboratorsComponent } from './collaborators.component';
import { CollaboratorsRoutingModule } from './collaborators-routing.module';

import { AddCollaboratorsDialogModule } from './add-collaborators-dialog/add-collaborators-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    CollaboratorsRoutingModule,
    ListViewModule,
    DropdownModule,
    InfiniteScrollModule,
    AddCollaboratorsDialogModule,
    ModalModule,
    Fabric8WitModule
  ],
  declarations: [
    CollaboratorsComponent
    ],
})
export class CollaboratorsModule {
  constructor(http: Http) { }
}
