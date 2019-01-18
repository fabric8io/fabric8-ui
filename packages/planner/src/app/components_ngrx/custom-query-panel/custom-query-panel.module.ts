import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { WidgetsModule } from 'ngx-widgets';

import { TruncateModule } from 'ng2-truncate';
import { TooltipModule } from 'ngx-bootstrap';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-modal';
import { CustomQueryService } from './../../services/custom-query.service';
import { IterationModule } from './../iterations-panel/iterations-panel.module';
import { CustomQueryComponent } from './custom-query-panel.component';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule,
    TooltipModule.forRoot(),
    TruncateModule,
    WidgetsModule,
    IterationModule,
    RouterModule,
  ],
  declarations: [CustomQueryComponent],
  exports: [CustomQueryComponent],
  providers: [BsDropdownConfig, CustomQueryService],
})
export class CustomQueryModule {}
