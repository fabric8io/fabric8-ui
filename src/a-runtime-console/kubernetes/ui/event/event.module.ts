import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MomentModule } from 'angular2-moment';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-modal';
import { Fabric8CommonModule } from '../../../common/common.module';
import { KubernetesComponentsModule } from '../../components/components.module';
import { EventsListPage } from './list-page/list-page.event.component';
import { EventsListToolbarComponent } from './list-toolbar/list-toolbar.event.component';
import { EventsListComponent } from './list/list.event.component';
import { EventViewPage } from './view-page/view-page.event.component';
import { EventViewToolbarComponent } from './view-toolbar/view-toolbar.event.component';
import { EventViewWrapperComponent } from './view-wrapper/view-wrapper.event.component';
import { EventViewComponent } from './view/view.event.component';

export const eventRoutes: Routes = [
  { path: '', component: EventsListPage },
  { path: ':id', component: EventViewPage }
];

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule,
    MomentModule,
    RouterModule.forChild(eventRoutes),
    Fabric8CommonModule,
    KubernetesComponentsModule
  ],
  declarations: [
    EventsListPage,
    EventsListToolbarComponent,
    EventsListComponent,
    EventViewPage,
    EventViewWrapperComponent,
    EventViewToolbarComponent,
    EventViewComponent
  ],
  exports: [
    ModalModule,
    EventsListComponent
  ],
  providers: [
    BsDropdownConfig
  ]
})
export class EventModule {
}
