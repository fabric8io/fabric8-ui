import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// import { KubernetesComponentsModule } from '../../../../a-runtime-console/kubernetes/components/components.module';
import { ApplicationsPipelineModule } from '../applications-pipeline/applications-pipeline.module';
import { ApplicationsListItemDetailsComponent } from './applications-list-item-details.component';

@NgModule({
  imports: [
    ApplicationsPipelineModule,
    CommonModule,
    FormsModule
    // KubernetesComponentsModule
  ],
  declarations: [ApplicationsListItemDetailsComponent],
  exports: [ApplicationsListItemDetailsComponent]
})
export class ApplicationsListItemDetailsModule { }
