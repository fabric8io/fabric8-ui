import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ModalModule } from 'ngx-modal';
import { ReplicaSetsListPage } from './list-page/list-page.replicaset.component';
import { ReplicaSetsListToolbarComponent } from './list-toolbar/list-toolbar.replicaset.component';
import { ReplicaSetsListComponent } from './list/list.replicaset.component';
import { ReplicaSetViewPage } from './view-page/view-page.replicaset.component';
import { ReplicaSetViewWrapperComponent } from './view-wrapper/view-wrapper.replicaset.component';
import { ReplicaSetViewToolbarComponent } from './view-toolbar/view-toolbar.replicaset.component';
import { ReplicaSetViewComponent } from './view/view.replicaset.component';
import { ReplicaSetEditPage } from './edit-page/edit-page.replicaset.component';
import { ReplicaSetEditWrapperComponent } from './edit-wrapper/edit-wrapper.replicaset.component';
import { ReplicaSetEditToolbarComponent } from './edit-toolbar/edit-toolbar.replicaset.component';
import { ReplicaSetEditComponent } from './edit/edit.replicaset.component';
import { ReplicaSetDeleteDialog } from './delete-dialog/delete-dialog.replicaset.component';
import { Fabric8CommonModule } from '../../../common/common.module';
import { ReplicaSetScaleDialog } from './scale-dialog/scale-dialog.replicaset.component';
import { MomentModule } from 'angular2-moment';
import { KubernetesComponentsModule } from '../../components/components.module';

export const replicaSetRoutes: Routes = [
  { path: '', component: ReplicaSetsListPage },
  { path: ':id', component: ReplicaSetViewPage },
  { path: ':id/edit', component: ReplicaSetEditPage }
];

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule,
    MomentModule,
    RouterModule.forChild(replicaSetRoutes),
    Fabric8CommonModule,
    KubernetesComponentsModule
  ],
  declarations: [
    ReplicaSetsListPage,
    ReplicaSetsListToolbarComponent,
    ReplicaSetsListComponent,
    ReplicaSetViewPage,
    ReplicaSetViewWrapperComponent,
    ReplicaSetViewToolbarComponent,
    ReplicaSetViewComponent,
    ReplicaSetEditPage,
    ReplicaSetEditWrapperComponent,
    ReplicaSetEditToolbarComponent,
    ReplicaSetEditComponent,
    ReplicaSetDeleteDialog,
    ReplicaSetScaleDialog
  ],
  entryComponents: [
    ReplicaSetDeleteDialog,
    ReplicaSetEditPage
  ],
  exports: [
    ModalModule,
    ReplicaSetsListComponent
  ],
  providers: [
    BsDropdownConfig
  ]
})
export class ReplicaSetModule {
}
