import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MomentModule } from 'angular2-moment';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-modal';
import { Fabric8CommonModule } from '../../../common/common.module';
import { KubernetesComponentsModule } from '../../components/components.module';
import { ServiceDeleteDialog } from './delete-dialog/delete-dialog.service.component';
import { ServiceEditPage } from './edit-page/edit-page.service.component';
import { ServiceEditToolbarComponent } from './edit-toolbar/edit-toolbar.service.component';
import { ServiceEditWrapperComponent } from './edit-wrapper/edit-wrapper.service.component';
import { ServiceEditComponent } from './edit/edit.service.component';
import { ServicesListPage } from './list-page/list-page.service.component';
import { ServicesListToolbarComponent } from './list-toolbar/list-toolbar.service.component';
import { ServicesListComponent } from './list/list.service.component';
import { ServiceViewPage } from './view-page/view-page.service.component';
import { ServiceViewToolbarComponent } from './view-toolbar/view-toolbar.service.component';
import { ServiceViewWrapperComponent } from './view-wrapper/view-wrapper.service.component';
import { ServiceViewComponent } from './view/view.service.component';

export const serviceRoutes: Routes = [
  { path: '', component: ServicesListPage },
  { path: ':id', component: ServiceViewPage },
  { path: ':id/edit', component: ServiceEditPage }
];

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule,
    MomentModule,
    RouterModule.forChild(serviceRoutes),
    Fabric8CommonModule,
    KubernetesComponentsModule
  ],
  declarations: [
    ServicesListPage,
    ServicesListToolbarComponent,
    ServicesListComponent,
    ServiceViewPage,
    ServiceViewWrapperComponent,
    ServiceViewToolbarComponent,
    ServiceViewComponent,
    ServiceEditPage,
    ServiceEditWrapperComponent,
    ServiceEditToolbarComponent,
    ServiceEditComponent,
    ServiceDeleteDialog
  ],
  entryComponents: [
    ServiceDeleteDialog,
    ServiceEditPage
  ],
  exports: [
    ModalModule,
    ServicesListComponent
  ],
  providers: [
    BsDropdownConfig
  ]
})
export class ServiceModule {
}
