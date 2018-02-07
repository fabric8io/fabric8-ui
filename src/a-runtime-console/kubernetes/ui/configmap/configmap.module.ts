import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MomentModule } from 'angular2-moment';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-modal';
import { Fabric8CommonModule } from '../../../common/common.module';
import { KubernetesComponentsModule } from '../../components/components.module';
import { ConfigMapDeleteDialog } from './delete-dialog/delete-dialog.configmap.component';
import { ConfigMapEditPage } from './edit-page/edit-page.configmap.component';
import { ConfigMapEditToolbarComponent } from './edit-toolbar/edit-toolbar.configmap.component';
import { ConfigMapEditWrapperComponent } from './edit-wrapper/edit-wrapper.configmap.component';
import { ConfigMapEditComponent } from './edit/edit.configmap.component';
import { ConfigMapsListPage } from './list-page/list-page.configmap.component';
import { ConfigMapsListToolbarComponent } from './list-toolbar/list-toolbar.configmap.component';
import { ConfigMapsListComponent } from './list/list.configmap.component';
import { ConfigMapViewPage } from './view-page/view-page.configmap.component';
import { ConfigMapViewToolbarComponent } from './view-toolbar/view-toolbar.configmap.component';
import { ConfigMapViewWrapperComponent } from './view-wrapper/view-wrapper.configmap.component';
import { ConfigMapViewComponent } from './view/view.configmap.component';

export const configMapRoutes: Routes = [
  { path: '', component: ConfigMapsListPage },
  { path: ':id', component: ConfigMapViewPage },
  { path: ':id/edit', component: ConfigMapEditPage }
];

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule,
    MomentModule,
    RouterModule.forChild(configMapRoutes),
    Fabric8CommonModule,
    KubernetesComponentsModule
  ],
  declarations: [
    ConfigMapsListPage,
    ConfigMapsListToolbarComponent,
    ConfigMapsListComponent,
    ConfigMapViewPage,
    ConfigMapViewWrapperComponent,
    ConfigMapViewToolbarComponent,
    ConfigMapViewComponent,
    ConfigMapEditPage,
    ConfigMapEditWrapperComponent,
    ConfigMapEditToolbarComponent,
    ConfigMapEditComponent,
    ConfigMapDeleteDialog
  ],
  entryComponents: [
    ConfigMapDeleteDialog,
    ConfigMapEditPage
  ],
  exports: [
    ModalModule,
    ConfigMapsListComponent
  ],
  providers: [
    BsDropdownConfig
  ]
})
export class ConfigMapModule {
}
