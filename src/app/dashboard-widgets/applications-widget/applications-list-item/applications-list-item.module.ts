import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { PipelineModule } from '../../../../a-runtime-console/kubernetes/ui/pipeline/pipeline.module';
import { ApplicationsListItemDetailsModule } from '../applications-list-item-details/applications-list-item-details.module';
import { ApplicationsStackReportModule } from '../applications-stack-report/applications-stack-report.module';
import { ApplicationsListItemComponent } from './applications-list-item.component';

@NgModule({
  imports: [
    ApplicationsListItemDetailsModule,
    ApplicationsStackReportModule,
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    PipelineModule,
    RouterModule
  ],
  declarations: [ApplicationsListItemComponent],
  exports: [ApplicationsListItemComponent],
  providers: [BsDropdownConfig]
})
export class ApplicationsListItemModule { }
