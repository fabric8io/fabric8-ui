import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToolbarPanelComponent } from './toolbar-panel.component';

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
    CommonModule,
    DropdownModule,
    ToolbarModule
  ],
  declarations: [
    ToolbarPanelComponent
  ],
  providers: [
    ComponentLoaderFactory,
    DropdownConfig,
    PositioningService,
    TooltipConfig
  ],
  exports: [ToolbarPanelComponent]
})
export class ToolbarPanelModule { }
