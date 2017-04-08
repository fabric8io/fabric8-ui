import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CodebasesToolbarComponent } from './codebases-toolbar.component';

import {
  ComponentLoaderFactory,
  DropdownConfig,
  DropdownModule,
  PositioningService,
  TooltipConfig
} from 'ng2-bootstrap';

import { ToolbarModule } from 'ngx-widgets';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    DropdownModule,
    ToolbarModule
  ],
  declarations: [
    CodebasesToolbarComponent
  ],
  providers: [
    ComponentLoaderFactory,
    DropdownConfig,
    PositioningService,
    TooltipConfig
  ],
  exports: [CodebasesToolbarComponent]
})
export class CodebasesToolbarModule { }
