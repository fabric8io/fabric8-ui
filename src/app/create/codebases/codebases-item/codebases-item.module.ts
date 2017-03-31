import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

import { CodebasesItemComponent } from './codebases-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule
  ],
  declarations: [ CodebasesItemComponent ],
  exports: [ CodebasesItemComponent ]
})
export class CodebasesItemModule {
  constructor(http: Http) {}
}
