import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StackDetailsModule } from 'fabric8-stack-analysis-ui';
import { ModalModule } from 'ngx-modal';
import { KubernetesComponentsModule } from '../../../../a-runtime-console/kubernetes/components/components.module';
import { ApplicationsStackReportComponent } from './applications-stack-report.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    KubernetesComponentsModule,
    ModalModule,
    RouterModule,
    StackDetailsModule
  ],
  declarations: [ApplicationsStackReportComponent],
  exports: [ApplicationsStackReportComponent]
})
export class ApplicationsStackReportModule { }
