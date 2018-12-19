import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { ClickOutModule } from '../../widgets/clickout/clickout.module';
import { FilterColumnModule } from './../../pipes/column-filter.module';
import { TableConfigComponent } from './table-config.component';

@NgModule({
  imports: [
    CommonModule,
    ClickOutModule,
    ClickOutModule,
    FilterColumnModule,
    BsDropdownModule,
    TooltipModule,
  ],
  declarations: [TableConfigComponent],
  exports: [TableConfigComponent],
  providers: [BsDropdownConfig, TooltipConfig],
})
export class TableConfigModule {}
