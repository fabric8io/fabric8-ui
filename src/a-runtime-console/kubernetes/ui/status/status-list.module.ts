import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MomentModule } from 'angular2-moment';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-modal';
import { Fabric8CommonModule } from '../../../common/common.module';
import { KubernetesComponentsModule } from '../../components/components.module';
import { NamespaceStore } from '../../store/namespace.store';
import { SpaceStore } from '../../store/space.store';
import { StatusInfoComponent } from './status-info-component';
import { StatusListComponent } from './status-list.component';


@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule,
    MomentModule,
    RouterModule,
    Fabric8CommonModule,
    KubernetesComponentsModule
  ],
  declarations: [
    StatusInfoComponent,
    StatusListComponent
  ],
  providers: [
    BsDropdownConfig,
    SpaceStore,
    NamespaceStore
  ],
  exports: [
    StatusInfoComponent,
    StatusListComponent
  ]
})
export class StatusListModule {
}
