import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ModalModule } from 'ngx-modal';
import { BuildConfigsListPage } from './list-page/list-page.buildconfig.component';
import { BuildConfigsListToolbarComponent } from './list-toolbar/list-toolbar.buildconfig.component';
import { BuildConfigsListComponent } from './list/list.buildconfig.component';
import { BuildConfigViewPage } from './view-page/view-page.buildconfig.component';
import { BuildConfigViewWrapperComponent } from './view-wrapper/view-wrapper.buildconfig.component';
import { BuildConfigViewToolbarComponent } from './view-toolbar/view-toolbar.buildconfig.component';
import { BuildConfigViewComponent } from './view/view.buildconfig.component';
import { BuildConfigEditPage } from './edit-page/edit-page.buildconfig.component';
import { BuildConfigEditWrapperComponent } from './edit-wrapper/edit-wrapper.buildconfig.component';
import { BuildConfigEditToolbarComponent } from './edit-toolbar/edit-toolbar.buildconfig.component';
import { BuildConfigEditComponent } from './edit/edit.buildconfig.component';
import { Fabric8CommonModule } from '../../../common/common.module';
import { MomentModule } from 'angular2-moment';
import { KubernetesComponentsModule } from '../../components/components.module';
import { BuildConfigDialogsModule } from './delete-dialog/buildconfig.dialogs.module';

const routes: Routes = [
  { path: '', component: BuildConfigsListPage },
  { path: ':id', component: BuildConfigViewPage },
  { path: ':id/edit', component: BuildConfigEditPage },
  { path: ':buildConfig/builds', loadChildren: '../build/build.module#BuildModule' }
];

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule,
    MomentModule,
    RouterModule.forChild(routes),
    Fabric8CommonModule,
    KubernetesComponentsModule,
    BuildConfigDialogsModule
  ],
  declarations: [
    BuildConfigsListPage,
    BuildConfigsListToolbarComponent,
    BuildConfigsListComponent,
    BuildConfigViewPage,
    BuildConfigViewWrapperComponent,
    BuildConfigViewToolbarComponent,
    BuildConfigViewComponent,
    BuildConfigEditPage,
    BuildConfigEditWrapperComponent,
    BuildConfigEditToolbarComponent,
    BuildConfigEditComponent
  ],
  entryComponents: [
    BuildConfigEditPage
  ],
  providers: [
    BsDropdownConfig
  ]
})
export class BuildConfigModule {
}
