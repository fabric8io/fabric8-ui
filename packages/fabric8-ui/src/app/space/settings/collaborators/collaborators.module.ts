import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { FeatureFlagModule } from 'ngx-feature-flag';
import { InfiniteScrollModule } from 'ngx-widgets';
import { ListModule } from 'patternfly-ng/list';
import { AddCollaboratorsDialogModule } from './add-collaborators-dialog/add-collaborators-dialog.module';
import { CollaboratorsRoutingModule } from './collaborators-routing.module';
import { CollaboratorsComponent } from './collaborators.component';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    CollaboratorsRoutingModule,
    ListModule,
    InfiniteScrollModule,
    AddCollaboratorsDialogModule,
    ModalModule.forRoot(),
    Fabric8WitModule,
    FeatureFlagModule
  ],
  declarations: [
    CollaboratorsComponent
  ],
  providers: [
    BsDropdownConfig
  ]
})
export class CollaboratorsModule {
  constructor() { }
}
