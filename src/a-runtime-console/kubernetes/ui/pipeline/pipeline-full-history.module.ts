import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ModalModule } from 'ngx-modal';
import { PipelinesFullHistoryPage } from './full-history-page/full-history-page.pipeline.component';
import { Fabric8CommonModule } from '../../../common/common.module';
import { MomentModule } from 'angular2-moment';
import { KubernetesComponentsModule } from '../../components/components.module';
import { BuildConfigDialogsModule } from '../buildconfig/delete-dialog/buildconfig.dialogs.module';
import { PipelineModule } from './pipeline.module';

const routes: Routes = [
  { path: '', component: PipelinesFullHistoryPage }
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
    BuildConfigDialogsModule,
    PipelineModule
  ],
  declarations: [
  ],
  entryComponents: [
  ],
  exports: [
  ],
  providers: [
    BsDropdownConfig
  ]
})
export class PipelineFullHistoryModule {
}
