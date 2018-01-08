import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Fabric8CommonModule } from '../../common/common.module';
import { BuildStatusIconComponent } from './build-status-icon/build-status-icon.component';
import { KubernetesLabelsComponent } from './k8s-labels/k8s-labels.component';
import { PipelineStatusComponent } from './pipeline-status/pipeline-status.component';
import { PodPhaseIconComponent } from './pod-phase-icon/pod-phase-icon.component';

@NgModule({
  imports: [
    CommonModule,
    Fabric8CommonModule
  ],
  declarations: [
    BuildStatusIconComponent,
    KubernetesLabelsComponent,
    PodPhaseIconComponent,
    PipelineStatusComponent
  ],
  exports: [
    BuildStatusIconComponent,
    KubernetesLabelsComponent,
    PodPhaseIconComponent,
    PipelineStatusComponent
  ]
})
export class KubernetesComponentsModule {
}
