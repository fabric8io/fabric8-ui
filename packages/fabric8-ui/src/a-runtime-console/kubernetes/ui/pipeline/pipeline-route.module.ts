import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MomentModule } from 'angular2-moment';
import { ModalModule } from 'ngx-modal';
import { Fabric8CommonModule } from '../../../common/common.module';
import { KubernetesComponentsModule } from '../../components/components.module';
import { PipelinesListPage } from './list-page/list-page.pipeline.component';
import { PipelineModule } from './pipeline.module';
import { PipelineViewPage } from './view-page/view-page.pipeline.component';

const routes: Routes = [
  { path: '', component: PipelinesListPage },
  { path: ':id', component: PipelineViewPage },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    MomentModule,
    RouterModule.forChild(routes),
    Fabric8CommonModule,
    KubernetesComponentsModule,
    PipelineModule,
  ],
  declarations: [],
  entryComponents: [],
  exports: [],
})
export class PipelineRouteModule {}
