import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FilterService } from '../../services/filter.service';
import { LabelsComponent } from './labels.component';
@NgModule({
  imports: [BsDropdownModule, CommonModule, RouterModule],
  declarations: [LabelsComponent],
  providers: [BsDropdownConfig, FilterService],
  exports: [LabelsComponent],
})
export class LabelsModule {}
