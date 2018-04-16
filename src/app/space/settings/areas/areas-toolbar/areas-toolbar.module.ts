import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToolbarModule } from 'patternfly-ng/toolbar';

import { AreasToolbarComponent } from './areas-toolbar.component';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    RouterModule,
    ToolbarModule,
    TooltipModule.forRoot()
  ],
  declarations: [
    AreasToolbarComponent
  ],
  providers: [
    BsDropdownConfig,
    TooltipConfig
  ],
  exports: [AreasToolbarComponent]
})
export class AreasToolbarModule { }
