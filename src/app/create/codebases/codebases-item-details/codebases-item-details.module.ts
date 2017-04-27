import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { CodebasesItemDetailsComponent } from './codebases-item-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ CodebasesItemDetailsComponent ],
  exports: [ CodebasesItemDetailsComponent ]
})
export class CodebasesItemDetailsModule {
  constructor(http: Http) {}
}
