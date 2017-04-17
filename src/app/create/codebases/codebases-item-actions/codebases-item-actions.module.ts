import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'ng2-bootstrap';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { SlideOutPanelModule } from 'ngx-widgets';

import { CodebasesItemActionsComponent } from './codebases-item-actions.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    SlideOutPanelModule
  ],
  declarations: [ CodebasesItemActionsComponent ],
  exports: [ CodebasesItemActionsComponent ]
})
export class CodebasesItemActionsModule {
  constructor(http: Http) {}
}
