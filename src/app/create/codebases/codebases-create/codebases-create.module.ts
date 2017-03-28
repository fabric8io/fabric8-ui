import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { SlideOutPanelModule } from 'ngx-widgets';

import { CodebasesCreateComponent } from './codebases-create.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    SlideOutPanelModule
  ],
  declarations: [ CodebasesCreateComponent ],
  exports: [ CodebasesCreateComponent ]
})
export class CodebasesCreateModule {
  constructor(http: Http) {}
}
