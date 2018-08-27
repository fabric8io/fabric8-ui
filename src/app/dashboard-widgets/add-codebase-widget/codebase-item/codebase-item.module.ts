import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CodebaseItemComponent } from './codebase-item.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ CodebaseItemComponent ],
  exports: [ CodebaseItemComponent ]
})
export class CodebaseItemModule { }
