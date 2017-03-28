import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { ListViewModule } from 'ngx-widgets';

import { CodebasesCreateModule } from './codebases-create/codebases-create.module';
import { CodebasesComponent } from './codebases.component';
import { CodebasesRoutingModule } from './codebases-routing.module';
import { ToolbarPanelModule } from '../../toolbar/toolbar-panel.module';

@NgModule({
  imports: [
    CommonModule,
    CodebasesCreateModule,
    CodebasesRoutingModule,
    FormsModule,
    HttpModule,
    ListViewModule,
    ToolbarPanelModule
  ],
  declarations: [ CodebasesComponent ],
  exports: [ CodebasesComponent ]
})
export class CodebasesModule {
  constructor(http: Http) {}
}
